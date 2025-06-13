module Users
  class ConfirmationsController < DeviseTokenAuth::ConfirmationsController
    def show
      # mark user as confirmed
      @resource = resource_class.confirm_by_token(params[:confirmation_token])

      if @resource.errors.empty?
        redirect_to DeviseTokenAuth.default_confirm_success_url + "?account_confirmation_success=true", allow_other_host: true
      else
        render json: {
          status: 'error',
          data: @resource,
          errors: @resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    end
  end
end
