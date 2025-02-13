Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'  # Allow requests from the React frontend
    resource '*', 
      headers: :any, 
      methods: [:get, :post, :patch, :put, :delete, :options], 
      credentials: true,
      expose: ['Authorization'] # If you are using JWT or custom headers, expose them
  end
end
