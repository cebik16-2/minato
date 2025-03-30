puts "🔥 Reloaded ProductsController at #{Time.now}"

class ProductsController < ApplicationController
  before_action :set_product, only: %i[show edit update destroy detach_file]
  before_action :set_user, only: %i[new create index show]

  # GET /products or /products.json
  def index
    @products = Product.page(params[:page]).per(params[:per])

    respond_to do |format|
      format.html
      format.json { render json: @products }
    end
  end

  # GET /products/1 or /products/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @product }
    end
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit; end

  # POST /products
  def create
    puts "🔥 LOADED FILE: #{__FILE__}"
    @product = @user.products.new(product_params.merge(seller_id: @user.id))

    if @product.save
      attach_files_to_product(@product)

      respond_to do |format|
        format.html { redirect_to @product, notice: "Product was successfully created." }
        format.json { render json: @product, status: :created }
      end
    else
      respond_to do |format|
        format.html { render :new, alert: "Failed to create product." }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/:id
  def update
    if @product.update(product_params)
      attach_files_to_product(@product)

      respond_to do |format|
        format.html do
          flash[:notice] = "Product was successfully updated."
          redirect_to @product
        end
        format.json { render json: @product }
      end
    else
      respond_to do |format|
        format.html { render :edit }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/:id
  def destroy
    @product.destroy!

    respond_to do |format|
      format.html do
        flash[:notice] = "Product was successfully destroyed."
        redirect_to products_path, status: :see_other
      end
      format.json { head :no_content }
    end
  end

  # DELETE /products/:id/detach_file/:file_id
  def detach_file
    file = @product.files.find_by(id: params[:file_id])

    if file
      file.purge
      respond_to do |format|
        format.html do
          flash[:notice] = "File was successfully deleted."
          redirect_to @product
        end
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.html do
          flash[:alert] = "File not found."
          redirect_to @product
        end
        format.json { render json: { error: "File not found" }, status: :not_found }
      end
    end
  end

  private

    def set_product
      @product = Product.find(params[:id])
    end

    def set_user
      if params[:user_id].present?
        @user = User.find_by(id: params[:user_id])
        unless @user
          respond_to do |format|
            format.html do
              redirect_to products_path, alert: "User not found."
            end
            format.json { render json: { error: "User not found" }, status: :not_found }
          end
        end
      else
        @user = current_user # fallback if user_id not passed
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
