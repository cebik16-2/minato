module Api
  class UsersController < ApplicationController
    before_action :authenticate_user!, only: %i[current update_current]

    def index
      users = User.all
      render json: users, status: :ok
    end

    def show
      user = User.find(params[:id])
      render json: user, status: :ok
    end

    def current
      render json: current_user, status: :ok
    end

    def update_current
      if current_user.update(user_params)
        render json: current_user, status: :ok
      else
        render json: current_user.errors, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.permit(:username, :email)
    end
  end
end
