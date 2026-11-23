class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?
  # The JSON API authenticates with a bearer token, so it has no CSRF
  # exposure and stays exempt. Every other format must fail closed with an
  # exception; :null_session would run the action without a session instead.
  protect_from_forgery with: :exception, unless: -> { request.format.json? }

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
