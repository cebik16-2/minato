class Category < ApplicationRecord
  # A product needs a category (category_id is NOT NULL), so nullify is not an
  # option here. Deleting a category must never take its products, favorites
  # and files with it: the delete is blocked and the reason is put on the
  # record instead. `destroy` returns false, `destroy!` raises.
  has_many :products, dependent: :restrict_with_error
end
