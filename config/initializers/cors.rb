Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:9000", "http://127.0.0.1:9000"

    resource "*",
      headers: :any,
      methods: [ :get, :post, :patch, :put, :delete, :options ],
      credentials: true,
      expose: [ "Authorization" ] # Expose headers if needed (e.g., JWT token)
  end
end
