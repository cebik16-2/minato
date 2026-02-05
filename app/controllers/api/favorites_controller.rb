module Api
  class FavoritesController < ApplicationController
    before_action :authenticate_user!

    def index
      favorites = current_user.favorites.includes(:product)
      render json: favorites
    end

    def create
      product_id = params.dig(:favorite, :product_id) || params.dig(:product_id)

      if product_id.blank?
        return render json: { error: 'product_id is required' }, status: :unprocessable_entity
      end

      favorite = current_user.favorites.build(product_id: product_id)

      if favorite.save
        render json: { favorite: favorite }, status: :created
      else
        render json: { errors: favorite.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      favorite = current_user.favorites.find_by(id: params[:id])

      if favorite
        favorite.destroy
        head :no_content
      else
        render json: { error: "Favorite not found" }, status: :not_found
      end
    end
  end
end
