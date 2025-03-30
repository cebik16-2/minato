class RemoveUserIdFromProducts < ActiveRecord::Migration[8.0]
  def change
    remove_column :products, :user_id, :integer
  end
end
