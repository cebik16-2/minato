class ProductSerializer < ActiveModel::Serializer
  attributes :id, :title, :price, :description, :category_id, :userid, :sku, :product_type

  def category_name
    object.category.name
  end

  belongs_to :category
  belongs_to :user
  has_many :files, serializer: FileAttachmentSerializer
end
