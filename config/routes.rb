Rails.application.routes.draw do
  # ✅ Use only Devise Token Auth for authentication
  mount_devise_token_auth_for 'User', at: 'auth'

  # 👤 User and product nesting
  resources :users, only: [:index, :show] do
    resources :products
  end

  # 💖 Favorites API
  resources :favorites, only: [:index, :create, :destroy]

  # 🌆 Cities and categories
  resources :cities, only: [:index]
  resources :categories, only: [:index]

  # 📦 Products with file detach route
  resources :products do
    member do
      delete "detach_file/:file_id", to: "products#detach_file", as: "detach_file"
    end
  end

  # 📋 Listings route (this was previously outside the block)
  resources :listings, only: [:index, :show]

  # 🏠 Welcome page & root
  get "welcome/index"
  root "welcome#index"

  # 🧪 Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # 🔧 PWA endpoints (uncomment if you use them)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
