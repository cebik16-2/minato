# products.category_id and products.seller_id had indexes but no foreign keys
# (B9), so rows could point at records that do not exist.
class AddForeignKeysToProducts < ActiveRecord::Migration[8.0]
  def up
    # A foreign key cannot be added while orphan rows exist, so the orphans go
    # first, together with the rows that point at them.
    say_with_time("Removing favorites without a user or a product") do
      execute(<<~SQL)
        DELETE FROM favorites
        WHERE user_id NOT IN (SELECT id FROM users)
           OR product_id NOT IN (SELECT id FROM products)
      SQL
    end

    say_with_time("Removing products without a category or a seller") do
      execute(<<~SQL)
        DELETE FROM products
        WHERE category_id NOT IN (SELECT id FROM categories)
           OR seller_id NOT IN (SELECT id FROM users)
      SQL
    end

    # Active Storage rows of removed products are not purged here. Purging
    # needs the app, not a migration.
    add_foreign_key :products, :categories
    add_foreign_key :products, :users, column: :seller_id
  end

  def down
    remove_foreign_key :products, :categories
    remove_foreign_key :products, column: :seller_id
  end
end
