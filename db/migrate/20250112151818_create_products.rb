class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :title
      t.decimal :price
      t.text :description
      t.references :category, null: false, foreign_key: false
      t.references :seller, null: false, foreign_key: false
      t.string :sku
      t.integer :product_type

      t.timestamps
    end
  end
end
