# app/controllers/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  # Skip the default Devise create action to customize it
  skip_before_action :verify_authenticity_token, only: [ :create ]

  # Override the Devise create method
  def create
    super do |resource|
      # Add the user_id to the session
      session[:user_id] = resource.id
    end
  end

  def destroy
    session[:user_id] = nil
    super
  end
end
