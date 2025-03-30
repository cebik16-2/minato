class User < ApplicationRecord
  # Devise modules for authentication and user management
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :confirmable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  # Products the user is selling
  has_many :listed_products, foreign_key: :seller_id, class_name: "Product", dependent: :destroy

  # Alias for products to avoid breaking existing code
  alias_method :products, :listed_products

  # Favorited products
  has_many :favorites, dependent: :destroy
  has_many :favorite_products, through: :favorites, source: :product

  # Profile picture attachment
  has_one_attached :profile_picture

  # Validations
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, uniqueness: true, format: { with: /\A\+?[0-9]{10,15}\z/ }, allow_blank: true

  # Helper method
  def full_name
    "#{first_name} #{last_name}".strip
  end
end
