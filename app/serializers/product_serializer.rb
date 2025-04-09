class ProductSerializer < ActiveModel::Serializer
  attributes :id, :title, :price, :description, :category_id, :sku, :product_type,
             :category_name, :created_at, :thumbnail_url, :image_urls

  belongs_to :category
  belongs_to :seller, class_name: "User"  # 👈 matches `seller_id`
  has_many :files, serializer: FileAttachmentSerializer

  def category_name
    object.category&.name
  end

  def thumbnail_url
    # return the first attached file's URL (for product card image)
    if object.files.attached?
      Rails.application.routes.url_helpers.rails_blob_url(object.files.first, only_path: true)
    end
  end

  def image_urls
    return [] unless object.files.attached?

    object.files.map do |file|
      Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
    end
  end
end