class ProductSerializer < ActiveModel::Serializer
  attributes :id, :title, :price, :description, :category_id, :seller_id, :sku, :product_type

  def category_name
    object.category.name
  end

  belongs_to :category
  belongs_to :seller
  has_many :files, serializer: FileAttachmentSerializer
end
