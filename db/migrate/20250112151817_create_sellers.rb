class CreateSellers < ActiveRecord::Migration[8.0]
  def change
    create_table :sellers do |t|
      t.string :first_name
      t.string :last_name
      t.string :country
      t.string :city
      t.string :district
      t.string :address
      t.string :phone
      t.string :mail
      t.text :bio
      t.string :profile_picture

      t.timestamps
    end

    # Adding an index on the email for faster lookups
    add_index :sellers, :phone, unique: true
  end
end
