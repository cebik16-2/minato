json.extract! seller, :id, :first_name, :last_name, :country, :city, :district, :address, :phone, :mail, :bio, :profile_picture, :created_at, :updated_at
json.url seller_url(seller, format: :json)
