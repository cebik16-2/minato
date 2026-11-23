class CategorySerializer < ActiveModel::Serializer
  # name and description exist in the categories table (see db/schema.rb).
  attributes :id, :name, :description
end
