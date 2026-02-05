# app/serializers/favorite_serializer.rb
class FavoriteSerializer < ActiveModel::Serializer
    attributes :id, :product_id
    belongs_to :product
  end
  