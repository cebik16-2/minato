Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:9000", "http://127.0.0.1:9000", "http://localhost:3000", "http://127.0.0.1:3000"

    resource "*",
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options, :head],
      credentials: true,
      expose: ["access-token", "client", "uid", "expiry", "token-type", "Authorization"]
  end
end
