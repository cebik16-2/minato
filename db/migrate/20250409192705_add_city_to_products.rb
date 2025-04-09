class AddCityToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :city, :string
  end
end
