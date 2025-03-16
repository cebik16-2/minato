class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?
  protect_from_forgery with: :null_session, if: -> { request.format.json? }

  respond_to :json

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
