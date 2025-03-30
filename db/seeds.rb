# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Category.find_or_create_by!(name: "Default")
Category.find_or_create_by!(name: "Electronics")
Category.find_or_create_by!(name: "Clothing")
Category.find_or_create_by!(name: "Books")
Category.find_or_create_by!(name: "Furniture") 
Category.find_or_create_by!(name: "Toys")
Category.find_or_create_by!(name: "Tools")
Category.find_or_create_by!(name: "Health & Beauty")
Category.find_or_create_by!(name: "Sports & Outdoors")
Category.find_or_create_by!(name: "Video Games")
Category.find_or_create_by!(name: "Automotive")
Category.find_or_create_by!(name: "Home & Garden")
Category.find_or_create_by!(name: "Pet Supplies")