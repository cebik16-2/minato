class User < ApplicationRecord
  # Include default devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :confirmable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  has_many :products, dependent: :destroy

  has_many :favorites, dependent: :destroy

  has_many :favorite_products, through: :favorites, source: :product

  has_one_attached :profile_picture

  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, uniqueness: true, format: { with: /\A\+?[0-9]{10,15}\z/ }, allow_blank: true

  def full_name
    "#{first_name} #{last_name}".strip
  end
end
