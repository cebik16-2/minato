puts "🔥 Reloaded ProductsController at #{Time.now}"

class ProductsController < ApplicationController
  before_action :authenticate_user!, only: %i[new create show update destroy]
  before_action :set_product, only: %i[show edit update destroy detach_file]

  # Public marketplace index
  def index
    products = Product
    .includes(:seller, files_attachments: :blob) # ✅
      .order(created_at: :desc)
      .page(params[:page])
      .per(params[:per_page] || 20)

    render json: products, each_serializer: ProductSerializer, meta: pagination_meta(products)
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
    puts "🔥 LOADED FILE: #{__FILE__}"
    @product = current_user.products.new(product_params)

    if @product.save
      attach_files_to_product(@product)
      render json: @product, status: :created
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
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

  def product_params
    params.require(:product).permit(:title, :price, :description, :category_id, :sku, :product_type)
  end

  def attach_files_to_product(product)
    return unless params[:product][:files]

    params[:product][:files].each do |file|
      product.files.attach(file)
    end
  end

  def pagination_meta(scope)
    {
      current_page: scope.current_page,
      next_page: scope.next_page,
      prev_page: scope.prev_page,
      total_pages: scope.total_pages,
      total_count: scope.total_count
    }
  end
end
