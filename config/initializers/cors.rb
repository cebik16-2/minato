Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*"  # Change this to restrict allowed domains (e.g., 'example.com')

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
