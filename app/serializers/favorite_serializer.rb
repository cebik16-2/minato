# A favorite record of the signed-in user.
class FavoriteSerializer < ActiveModel::Serializer
  attributes :id, :product_id, :created_at

  # The web client calls a marketplace item a "listing", so the product id is
  # also exposed under that name and the current client keeps working. Drop
  # this once the client reads product_id.
  def listing_id
    object.product_id
  end
end
