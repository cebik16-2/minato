class AddCommentToProductType < ActiveRecord::Migration[8.0]
  def change
    # Add a comment to the product_type column in products table
    change_column_comment :products, :product_type, 'Defines the type of product (e.g., 1 - pickup)'
  end
end
