# devise-jwt revocation with the JTIMatcher strategy (B3). The column holds
# the jti claim of the tokens issued for that user. Writing a new value to it
# revokes every token issued before.
class AddJtiToUsers < ActiveRecord::Migration[8.0]
  def up
    add_column :users, :jti, :uuid

    # Existing rows need a value: NULL would revoke every token issued before
    # this migration. gen_random_uuid() needs PostgreSQL 13 or newer.
    execute("UPDATE users SET jti = gen_random_uuid() WHERE jti IS NULL")

    change_column_null :users, :jti, false
    add_index :users, :jti, unique: true
  end

  def down
    remove_index :users, :jti
    change_column_null :users, :jti, true
    remove_column :users, :jti
  end
end
