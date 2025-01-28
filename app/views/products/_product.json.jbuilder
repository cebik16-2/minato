json.extract! product, :id, :title, :price, :description, :category_id, :sku, :product_type, :created_at, :updated_at
json.url product_url(product, format: :json)
