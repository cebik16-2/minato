module Users
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token, raise: false, only: [:create, :destroy]

    private

    # ✅ FIX: Ensure JWT token is retrieved and logged properly
    def respond_with(resource, _opts = {})
      token = request.env["warden-jwt_auth.token"]

      Rails.logger.info "🔹 User Login Attempt: #{resource.email}" # ✅ Log user login
      Rails.logger.info "🔹 JWT Token Generated: #{token}" if token.present? # ✅ Log token

      if token.present?
        render json: {
          message: "Logged in successfully",
          user: resource.as_json(except: [ :encrypted_password, :reset_password_token, :reset_password_sent_at, :remember_created_at ]),
          token: token
        }, status: :ok
      else
        Rails.logger.error "🚨 ERROR: JWT Token could not be retrieved after login."
        render json: { error: "JWT Token could not be generated." }, status: :unprocessable_entity
      end
    end

    # ✅ FIX: Ensure Devise properly logs out the user
    def respond_to_on_destroy
      jwt_payload = request.env["warden-jwt_auth.token"]
      Rails.logger.info "🔹 Logout Attempt - JWT Payload: #{jwt_payload.inspect}" if jwt_payload

      if current_user
        sign_out(current_user)
        Rails.logger.info "✅ User logged out: #{current_user.email}"
        render json: { message: "Logged out successfully." }, status: :ok
      else
        Rails.logger.error "🚨 ERROR: No active session found for logout."
        render json: { error: "No active session found." }, status: :unauthorized
      end
    end
  end
end
