# username and phone uniqueness lived only in the model (B20), so two parallel
# requests could both pass the validation and insert a duplicate. Both columns
# are optional, so the indexes are partial: NULL is not compared and users
# without a username or a phone stay valid.
class AddUniqueIndexesToUsers < ActiveRecord::Migration[8.0]
  def up
    # An empty string means "not given".
    execute("UPDATE users SET phone = NULL WHERE phone = ''")

    # Duplicates would make the index fail. Keep the oldest row per value and
    # clear the column on the others. The model validation stops new ones.
    say_with_time("Clearing duplicated usernames") do
      execute(<<~SQL)
        UPDATE users
        SET username = NULL
        WHERE username IS NOT NULL
          AND id NOT IN (
            SELECT MIN(id) FROM users WHERE username IS NOT NULL GROUP BY username
          )
      SQL
    end

    say_with_time("Clearing duplicated phone numbers") do
      execute(<<~SQL)
        UPDATE users
        SET phone = NULL
        WHERE phone IS NOT NULL
          AND id NOT IN (
            SELECT MIN(id) FROM users WHERE phone IS NOT NULL GROUP BY phone
          )
      SQL
    end

    add_index :users, :username, unique: true, where: "username IS NOT NULL"
    add_index :users, :phone, unique: true, where: "phone IS NOT NULL"
  end

  def down
    remove_index :users, :username
    remove_index :users, :phone
  end
end
