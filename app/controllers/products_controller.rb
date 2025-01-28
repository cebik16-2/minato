class ProductsController < ApplicationController
  before_action :set_product, only: %i[ show edit update destroy detach_file ]
  before_action :set_seller, only: [ :new, :create, :index, :show ]

  # GET /products or /products.json
  def index
    @products = Product.page(params[:page]).per(params[:per])

    respond_to do |format|
      format.html # Renders the default HTML view (index.html.erb)
      format.json { render json: @products }
    end
  end

  # GET /products/1 or /products/1.json
  def show
    respond_to do |format|
      format.html # Renders the default HTML view (index.html.erb)
      format.json { render json: @product } # Uses ProductSerializer automatically
    end
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
  end

  # POST /products
  # Create a new product with attached files (photos, audios, videos)
  def create
    @product = Product.new(product_params)

    if @product.save
      attach_files_to_product(@product)
      respond_to do |format|
        format.html { redirect_to @product, notice: "Product was successfully created." }
        format.json { render json: @product, status: :created }
      end
    else
      respond_to do |format|
        format.html { render :new }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/:id
  # Update a product with new files attached
  def update
    if @product.update(product_params)
      attach_files_to_product(@product)
      respond_to do |format|
        format.html { redirect_to @product, notice: "Product was successfully updated." }
        format.json { render json: @product }
      end
    else
      respond_to do |format|
        format.html { render :edit }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1 or /products/1.json
  def destroy
    @product.destroy!

    respond_to do |format|
      format.html { redirect_to products_path, status: :see_other, notice: "Product was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  # DELETE /products/:id/detach_file/:file_id
  # Detach a specific file from a product
  def detach_file
    file = @product.files.find(params[:file_id])
    if file
      file.purge # Purge deletes the file from storage
      respond_to do |format|
        format.html { redirect_to @product, notice: "File was successfully deleted." }
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.html { redirect_to @product, alert: "File not found." }
        format.json { render json: { error: "File not found" }, status: :not_found }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params.expect(:id))
    end

    def set_seller
      if params[:seller_id]
        @seller = Seller.find(params[:seller_id])  # Find seller by seller_id from URL
      end
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.expect(product: [ :title, :price, :description, :category_id, :seller_id, :sku, :product_type ])
    end

    # Helper method to handle file attachment logic
    def attach_files_to_product(product)
      if params[:product][:files]
        params[:product][:files].each do |file|
          product.files.attach(file)
        end
      end
    end
end
