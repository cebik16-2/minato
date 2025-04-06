# config/initializers/session_store.rb

Rails.application.config.session_store :cookie_store, key: '_minato_session'

# Since you're using `api_only`, you need to manually add session middleware
Rails.application.config.middleware.use ActionDispatch::Cookies
Rails.application.config.middleware.use ActionDispatch::Session::CookieStore, key: '_minato_session'
