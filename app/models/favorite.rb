class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :product

  # A user favorites a product once. The model stops the common case and a
  # unique index on (user_id, product_id) stops the race.
  validates :product_id, uniqueness: { scope: :user_id }
end
