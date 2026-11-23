class FileAttachmentSerializer < ActiveModel::Serializer
  attributes :url, :filename, :content_type

  # Absolute URL of the blob. No host is hardcoded here. Production sets
  # Rails.application.routes.default_url_options from APP_HOST in
  # config/environments/production.rb.
  def url
    helpers = Rails.application.routes.url_helpers

    if Rails.application.routes.default_url_options[:host].present?
      helpers.rails_blob_url(object)
    else
      # Development and test set no host. APP_HOST overrides the fallback.
      helpers.rails_blob_url(object, host: ENV.fetch("APP_HOST", "localhost:3000"))
    end
  end

  def filename
    # Return the filename as a string
    object.filename.to_s
  end

  def content_type
    # Return the content type (MIME type) of the blob
    object.content_type
  end
end
