# app/controllers/api/rails/health_controller.rb
module Api
  module Rails
    class HealthController < ::Rails::HealthController
      def show
        render json: { status: "ok", timestamp: Time.now.utc }
      end
    end
  end
end
# frozen_string_literal: true
# This controller inherits from Rails::HealthController to provide a health check endpoint
# for the API namespace. It allows external services to check the health of the Rails application.
# The endpoint can be accessed via GET requests to /api/rails/health.
# This is useful for monitoring and ensuring that the application is running correctly.