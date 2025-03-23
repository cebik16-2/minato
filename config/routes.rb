Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: "users/sessions" }

  resources :users, only: [ :index, :show ] do
    resources :products # Nested resources for products
  end

  resources :favorites, only: [ :index, :create, :destroy ] # adjust actions as needed
  resources :cities, only: [ :index ] # assuming you just need to list them
  resources :categories

  resources :products do
    member do
      delete "detach_file/:file_id", to: "products#detach_file", as: "detach_file"
    end
  end

  resources :listings, only: [ :index, :show ] # Add this line to create a /listings endpoint

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
