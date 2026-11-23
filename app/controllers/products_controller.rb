class ProductsController < ApplicationController
  DEFAULT_PER_PAGE = 25
  MAX_PER_PAGE = 100

  before_action :authenticate_user!, except: %i[index show]
  before_action :set_product, only: %i[show edit update destroy detach_file]
  before_action :authorize_owner!, only: %i[edit update destroy detach_file]
  before_action :set_user, only: %i[index show]
  before_action :set_current_user, only: %i[new create]

  def index
    # A user filter lists that seller's products. Without a filter the public
    # catalogue is listed, never the caller's own subset.
    scope = params[:user_id].present? ? @user.products : Product.all

    @products = scope
      .includes(:category, :seller, files_attachments: :blob)
      .order(created_at: :desc, id: :desc)
      .page(params[:page])
      .per(per_page)

    render json: @products
  end

  def show
    render json: @product
  end

  def new
    @product = Product.new
    render json: @product
  end

  def edit
    render json: @product
  end

  def create
    if (reason = files_rejection_reason)
      render json: { error: reason }, status: :unprocessable_entity
      return
    end

    @product = @user.products.new(product_params.except(:files).merge(seller_id: @user.id))

    if @product.save
      attach_files_to_product(@product)
      render json: @product, status: :created
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def update
    if (reason = files_rejection_reason)
      render json: { error: reason }, status: :unprocessable_entity
      return
    end

    if @product.update(product_params.except(:files))
      attach_files_to_product(@product)
      render json: @product
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy!
    head :no_content
  end

  def detach_file
    file = @product.files.find_by(id: params[:file_id])

    if file
      file.purge
      head :no_content
    else
      render json: { error: "File not found" }, status: :not_found
    end
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  # Read-only: params[:user_id] only selects whose products to list.
  def set_user
    if params[:user_id].present?
      @user = User.find_by(id: params[:user_id])
      return render json: { error: "User not found" }, status: :not_found unless @user
    else
      @user = current_user
    end
  end

  # Write path: never read params[:user_id]. The seller is always the caller.
  def set_current_user
    @user = current_user
  end

  # Only the seller of a product may change or remove it.
  def authorize_owner!
    return if @product.seller_id == current_user.id

    render json: { error: "Forbidden" }, status: :forbidden
  end

  # files are permitted here, so uploads no longer bypass strong params.
  # They are checked in files_rejection_reason before they are attached.
  def product_params
    params.require(:product).permit(:title, :price, :description, :category_id, :sku, :product_type, files: [])
  end

  # Page size for index. ?per=0 or a bad value falls back to the default and a
  # big value is capped, so one request cannot pull the whole table.
  def per_page
    requested = params[:per].to_i
    return DEFAULT_PER_PAGE if requested <= 0

    [ requested, MAX_PER_PAGE ].min
  end

  # The uploads that passed strong params, as an array (empty when there are
  # none, for example on a JSON request).
  def uploaded_files
    files = product_params[:files]
    return [] if files.blank?

    Array(files)
  end

  # Returns an error message when an upload is not allowed, nil when all of
  # them are. Only the image types in Product::ALLOWED_FILE_CONTENT_TYPES and
  # at most Product::MAX_FILE_SIZE each are accepted.
  def files_rejection_reason
    uploaded_files.each do |file|
      unless file.respond_to?(:content_type) && file.respond_to?(:size)
        return "Every file must be an uploaded file."
      end

      unless Product::ALLOWED_FILE_CONTENT_TYPES.include?(file.content_type.to_s)
        return "Unsupported content type #{file.content_type}. Allowed: #{Product::ALLOWED_FILE_CONTENT_TYPES.join(", ")}."
      end

      if file.size.to_i > Product::MAX_FILE_SIZE
        name = file.respond_to?(:original_filename) ? file.original_filename : file.to_s
        return "File #{name} is bigger than #{Product::MAX_FILE_SIZE / 1.megabyte} MB."
      end
    end

    nil
  end

  def attach_files_to_product(product)
    uploaded_files.each do |file|
      product.files.attach(file)
    end
  end
end
