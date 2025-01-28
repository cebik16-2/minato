class FileAttachmentSerializer < ActiveModel::Serializer
  attributes :url, :filename, :content_type

  def url
    Rails.logger.debug("My object: #{object.inspect}")

    # Generate the URL for the file using ActiveStorage URL helper
    # TODO: remove host in prodzz
    Rails.application.routes.url_helpers.rails_blob_url(object, host: "0.0.0.0:3000")
  end

  def filename
    # Return the filename as a string
    object.filename.to_s
  end

  def content_type
    # Return the content type (MIME type) of the file
    object.content_type
  end
end
