# A user could favorite the same product many times (B10): no validation and
# no index stopped it.
class DedupeFavoritesAndAddUniqueIndex < ActiveRecord::Migration[8.0]
  def up
    # The index fails while duplicates exist, so keep the newest row of each
    # (user, product) pair and drop the rest.
    say_with_time("Removing duplicate favorites") do
      execute(<<~SQL)
        DELETE FROM favorites a
        USING favorites b
        WHERE a.id > b.id
          AND a.user_id = b.user_id
          AND a.product_id = b.product_id
      SQL
    end

    add_index :favorites, %i[user_id product_id], unique: true
  end

  def down
    remove_index :favorites, %i[user_id product_id]
  end
end
