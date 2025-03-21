class Product < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many_attached :files

  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user

  validates :category, presence: true
  validates :user, presence: true
  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  def category_name
    category&.name
  end
end
