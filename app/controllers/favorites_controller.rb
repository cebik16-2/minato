class FavoritesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_product, only: %i[create]

  # GET /favorites - the favorites of the signed-in user.
  def index
    render json: current_user.favorites.order(:id)
  end

  # POST /favorites - favorite a product for the signed-in user.
  # The id arrives as product_id. The web client still sends it as listing_id,
  # because it calls a marketplace item a listing; both names are accepted.
  def create
    if @product.nil?
      render json: { error: "Product not found" }, status: :not_found
      return
    end

    favorite = current_user.favorites.find_or_initialize_by(product_id: @product.id)

    if favorite.persisted?
      # Already favorited. Answer with the record instead of an error, so the
      # caller does not have to treat a repeated click as a failure.
      render json: favorite, status: :ok
      return
    end

    if favorite.save
      render json: favorite, status: :created
    else
      render json: favorite.errors, status: :unprocessable_entity
    end
  end

  # DELETE /favorites/:id - remove one favorite of the signed-in user.
  # :id is the favorite id. The web client only knows the product id, so that
  # is accepted as a fallback. The lookup is scoped to current_user, so nobody
  # can delete another user's favorite.
  def destroy
    favorite = current_user.favorites.find_by(id: params[:id]) ||
               current_user.favorites.find_by(product_id: params[:id])

    if favorite
      favorite.destroy!
      head :no_content
    else
      render json: { error: "Favorite not found" }, status: :not_found
    end
  end

  private

  def set_product
    @product = Product.find_by(id: favorite_params[:product_id] || favorite_params[:listing_id])
  end

  def favorite_params
    params.fetch(:favorite, {}).permit(:product_id, :listing_id)
  end
end
