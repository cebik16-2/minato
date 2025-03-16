Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: "users/sessions" }
  resources :users, only: [:index, :show]
  resources :users do
    resources :products # Nested resources for products
  end
  resources :categories
    resources :products do
      member do
        delete "detach_file/:file_id", to: "products#detach_file", as: "detach_file"
      end
    end
    get "welcome/index"
  root "welcome#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
  # ✅ Add this line to create a /listings endpoint
  resources :listings, only: [:index, :show]

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
