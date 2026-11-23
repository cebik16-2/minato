class Product < ApplicationRecord
  # Upload allowlist. Only these image types, and at most MAX_FILE_SIZE each.
  ALLOWED_FILE_CONTENT_TYPES = [ "image/jpeg", "image/png", "image/webp" ].freeze
  MAX_FILE_SIZE = 10.megabytes

  belongs_to :seller, class_name: "User", foreign_key: "seller_id"
  belongs_to :category
  has_many_attached :files

  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user

  validates :category, presence: true
  validates :seller, presence: true
  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  def category_name
    category&.name
  end
end
