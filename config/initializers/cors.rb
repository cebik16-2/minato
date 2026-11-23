# Origins allowed to call this API from a browser. The list comes from the
# environment as a comma separated string, for example
#   CORS_ALLOWED_ORIGINS="https://app.example.com,https://www.example.com"
# Development keeps the Vite dev server when the variable is not set.
# Production fails closed: with no variable, no origin is allowed.
default_origins = Rails.env.production? ? "" : "http://localhost:5173,http://127.0.0.1:5173"

allowed_origins = ENV.fetch("CORS_ALLOWED_ORIGINS", default_origins)
                              .split(",")
                              .map(&:strip)
                              .reject(&:empty?)

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins allowed_origins

    resource "*",
      headers: :any,
      methods: [ :get, :post, :patch, :put, :delete, :options ],
      credentials: true,
      expose: [ "Authorization" ] # Expose headers if needed (e.g., JWT token)
  end
end
