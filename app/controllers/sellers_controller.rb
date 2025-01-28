class SellersController < ApplicationController
  before_action :set_seller, only: %i[ show edit update destroy ]
  before_action :authenticate_user!

  # GET /sellers or /sellers.json
  def index
    @sellers = Seller.page(params[:page]).per(params[:per])

    respond_to do |format|
      format.html # Renders the default HTML view (index.html.erb)
      format.json { render json: @sellers }
    end
  end

  # GET /sellers/1 or /sellers/1.json
  def show
    # respond_to do |format|
    #   format.html # renders the default view
    #   format.json { render json: @seller, include: :products }
    # end
  end

  # GET /sellers/new
  def new
    @seller = Seller.new
  end

  # GET /sellers/1/edit
  def edit
  end

  # POST /sellers or /sellers.json
  def create
    @seller = Seller.new(seller_params)

    respond_to do |format|
      if @seller.save
        format.html { redirect_to @seller, notice: "Seller was successfully created." }
        format.json { render :show, status: :created, location: @seller }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @seller.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sellers/1 or /sellers/1.json
  def update
    respond_to do |format|
      if @seller.update(seller_params)
        format.html { redirect_to @seller, notice: "Seller was successfully updated." }
        format.json { render :show, status: :ok, location: @seller }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @seller.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sellers/1 or /sellers/1.json
  def destroy
    @seller.destroy!

    respond_to do |format|
      format.html { redirect_to sellers_path, status: :see_other, notice: "Seller was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def products
    @products = @seller.products
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_seller
      @seller = Seller.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def seller_params
      params.expect(seller: [ :first_name, :last_name, :country, :city, :district, :address, :phone, :mail, :bio, :profile_picture ])
    end
end
