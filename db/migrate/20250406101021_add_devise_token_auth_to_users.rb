class AddDeviseTokenAuthToUsers < ActiveRecord::Migration[8.0]
  # This migration adds columns to the users table for token authentication
  # using Devise and Devise Token Auth.
  #
  # It adds:
  # - provider: The authentication provider (default is 'email').
  # - uid: The unique identifier for the user.
  # - tokens: A JSON column to store the user's tokens.
  #
  # It also adds a unique index on the combination of uid and provider.
  def change
    add_column :users, :provider, :string, null: false, default: 'email'
    add_column :users, :uid, :string, null: false, default: ''
    add_column :users, :tokens, :json

    add_index :users, [:uid, :provider], unique: true
  end
end