class Seller < ApplicationRecord
  has_many :products, dependent: :destroy

  has_one_attached :profile_picture

  validates :first_name, :last_name, :country, :city, :address, :mail, :phone, presence: true
  validates :phone, uniqueness: true

  def full_name
    object.first_name + " " + object.last_name
  end
end
