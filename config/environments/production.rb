require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Turn on fragment caching in view templates.
  config.action_controller.perform_caching = true

  # Cache assets for far-future expiry since they are all digest stamped.
  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Skip http-to-https redirect for the default health check endpoint.
  # config.ssl_options = { redirect: { exclude: ->(request) { request.path == "/up" } } }

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Change to "debug" to log everything (including potentially personally-identifiable information!)
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = "/up"

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Replace the default in-process memory cache store with a durable alternative.
  config.cache_store = :solid_cache_store

  # Replace the default in-process and non-durable queuing backend for Active Job.
  config.active_job.queue_adapter = :solid_queue
  config.solid_queue.connects_to = { database: { writing: :queue } }

  # Host of this API, for example api.example.com. Set APP_HOST in the deploy
  # environment. It builds the links in mails and the absolute file URLs.
  app_host = ENV.fetch("APP_HOST", "localhost")

  # Absolute URLs built outside a request (Active Storage blobs) need a host.
  # See app/serializers/file_attachment_serializer.rb.
  Rails.application.routes.default_url_options = { host: app_host, protocol: "https" }

  # Links in mails point at this API host. User has :confirmable, so a broken
  # mailer means nobody can confirm an account.
  config.action_mailer.default_url_options = { host: app_host, protocol: "https" }

  # Delivery stays non-raising: a mail server outage must not take the API
  # down. The trade-off is that with :confirmable a broken SMTP silently stops
  # new accounts from being confirmed, so watch the delivery logs.
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.perform_deliveries = true

  # SMTP settings come from the environment. No credentials in the repository.
  # Set SMTP_ADDRESS, and SMTP_PORT, SMTP_DOMAIN, SMTP_USERNAME,
  # SMTP_PASSWORD, SMTP_AUTHENTICATION as needed. When SMTP_ADDRESS is not
  # set, Rails keeps its default server and every delivery fails: :confirmable
  # then does not work, so set SMTP_ADDRESS in production.
  if ENV["SMTP_ADDRESS"].present?
    smtp_user = ENV["SMTP_USERNAME"]
    smtp_password = ENV["SMTP_PASSWORD"]

    smtp_settings = {
      address: ENV.fetch("SMTP_ADDRESS"),
      port: ENV.fetch("SMTP_PORT", "587").to_i,
      domain: ENV.fetch("SMTP_DOMAIN", app_host),
      enable_starttls_auto: true
    }

    if smtp_user.present? && smtp_password.present?
      smtp_settings[:user_name] = smtp_user
      smtp_settings[:password] = smtp_password
      smtp_settings[:authentication] = ENV.fetch("SMTP_AUTHENTICATION", "plain").to_sym
    end

    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = smtp_settings
  end

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only use :id for inspections in production.
  config.active_record.attributes_for_inspect = [ :id ]

  # Enable DNS rebinding protection and other `Host` header attacks.
  # config.hosts = [
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  #
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }
end
