class AddDetailsToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :manufacturer, :string
    add_column :products, :model, :string
    add_column :products, :year, :integer
    add_column :products, :condition, :string
  end
end
