module Api
  class CategoriesController < ApplicationController
    before_action :set_category, only: %i[show update destroy]

    # GET /api/categories or /api/categories.json
    def index
      categories = Category.select(:id, :name)
      render json: { categories: categories }
    end

    # GET /api/categories/1 or /api/categories/1.json
    def show
      render json: @category
    end

    # POST /api/categories or /api/categories.json
    def create
      @category = Category.new(category_params)

      if @category.save
        render json: @category, status: :created, location: @category
      else
        render json: @category.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/categories/1 or /api/categories/1.json
    def update
      if @category.update(category_params)
        render json: @category, status: :ok, location: @category
      else
        render json: @category.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/categories/1 or /api/categories/1.json
    def destroy
      @category.destroy!
      head :no_content
    end

    private

    def set_category
      @category = Category.find(params[:id])
    end

    def category_params
      params.require(:category).permit(:name, :description)
    end
  end
end
