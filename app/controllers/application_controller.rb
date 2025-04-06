class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      :username, :first_name, :last_name, :country, :city, :address, :email, :phone
    ])

    devise_parameter_sanitizer.permit(:account_update, keys: [
      :username, :first_name, :last_name, :country, :city, :address, :email, :phone, :profile_picture
    ])
  end
end
