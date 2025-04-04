puts "🔥 Reloaded ProductsController at #{Time.now}"

class ProductsController < ApplicationController
  before_action :set_product, only: %i[show edit update destroy detach_file]
  before_action :set_user, only: %i[new create index show]

  def index
    @products = Product.page(params[:page]).per(params[:per])
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
    puts "🔥 LOADED FILE: #{__FILE__}"
    @product = @user.products.new(product_params.merge(seller_id: @user.id))

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

  def set_user
    if params[:user_id].present?
      @user = User.find_by(id: params[:user_id])
      return render json: { error: "User not found" }, status: :not_found unless @user
    else
      @user = current_user
    end
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
end
