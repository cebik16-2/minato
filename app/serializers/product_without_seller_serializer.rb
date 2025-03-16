class ProductWithoutUserSerializer < ActiveModel::Serializer
  attributes :id, :title, :price, :description, :category_id, :category_name, :user_id, :sku, :product_type
  belongs_to :category
  has_many :files, serializer: FileAttachmentSerializer

  def category_name
    object.category.name
  end

  # You can format attributes if needed
  def created_at
    object.created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def updated_at
    object.updated_at.strftime("%Y-%m-%d %H:%M:%S")
  end
end
