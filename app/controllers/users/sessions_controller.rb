module Users
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token, only: [ :create, :destroy ]

    private

    # Never log the email or the JWT: both are sensitive / live credentials.
    def respond_with(resource, _opts = {})
      token = request.env["warden-jwt_auth.token"]

      if token.present?
        render json: {
          message: "Logged in successfully",
          user: UserSerializer.new(resource).as_json,
          token: token
        }, status: :ok
      else
        Rails.logger.error "🚨 ERROR: JWT Token could not be retrieved after login."
        render json: { error: "JWT Token could not be generated." }, status: :unprocessable_entity
      end
    end

    def respond_to_on_destroy
      # Capture the user before sign_out: current_user is nil afterwards.
      user = current_user

      if user
        sign_out(user)
        Rails.logger.info "✅ User logged out"
        render json: { message: "Logged out successfully." }, status: :ok
      else
        Rails.logger.error "🚨 ERROR: No active session found for logout."
        render json: { error: "No active session found." }, status: :unauthorized
      end
    end
  end
end
