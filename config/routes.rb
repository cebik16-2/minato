Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: "users/sessions" }

  # The web client calls GET /users and GET /users/:id (admin screens), so
  # both stay. They are gated by authenticate_user! in UsersController and
  # UserSerializer exposes only safe fields. No other user route is exposed.
  resources :users, only: [ :index, :show ] do
    resources :products # Nested resources for products
  end

  resources :favorites, only: [ :index, :create, :destroy ] # adjust actions as needed
  resources :cities, only: [ :index ] # assuming you just need to list them
  resources :categories, only: [:index] # assuming you just need to list them

  resources :products do
    member do
      delete "detach_file/:file_id", to: "products#detach_file", as: "detach_file"
    end
  end

  # Only :index. ListingsController has no show action, so :show raised
  # ActionNotFound, and the web client only calls GET /listings.
  resources :listings, only: [ :index ]

  get "welcome/index"
  root "welcome#index"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
