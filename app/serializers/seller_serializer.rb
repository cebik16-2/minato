class SellerSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :country, :city, :district, :address, :phone, :mail, :bio, :created_at, :updated_at

  # You can format attributes if needed
  def created_at
    object.created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def updated_at
    object.updated_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  # Avoid circular reference by customizing products serialization
  has_many :products, serializer: ProductWithoutSellerSerializer
  has_one :profile_picture, serializer: FileAttachmentSerializer
end
