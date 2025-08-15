source "https://rubygems.org"

# SMTP
gem "net-smtp", "~> 0.5.0"
gem "rails", "~> 8.0.1"
gem "propshaft"
gem "pg", "~> 1.4"
gem "puma", ">= 5.0"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"
gem "jwt"
gem "active_model_serializers"
gem "kaminari"

# Modernized platform list to avoid deprecated :mingw/:mswin warnings
gem "tzinfo-data", platforms: %i[windows jruby]

gem "solid_cache", "0.4.0"
gem "solid_queue", "0.6.0"
gem "solid_cable"

gem "bootsnap", require: false
gem "kamal", require: false
gem "thruster", require: false

group :development do
  # Do NOT force-load debug/prelude via Bundler; Rails will require it in dev only if present.
  gem "debug"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
end

group :test do
  # test-only gems if needed
end

group :development do
  gem "web-console"
end

gem "devise", "~> 4.9"
gem "devise-jwt"
gem "devise_token_auth"
gem "omniauth"
gem "rack-cors", require: "rack/cors"
