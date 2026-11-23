class User < ApplicationRecord
  # Devise modules for authentication and user management
  # JTIMatcher is the devise-jwt revocation strategy. It is a module: it adds
  # the class methods devise-jwt calls, so the model passes itself as the
  # strategy. It needs the `jti` column (see db/migrate) and it revokes the
  # token on sign out, so a stolen token dies with the session.
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :confirmable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: self

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
  # Unique in the model and in the database (partial unique index), so two
  # parallel requests cannot both pass the check.
  validates :username, uniqueness: true, allow_blank: true
  validates :phone, uniqueness: true, format: { with: /\A\+?[0-9]{10,15}\z/ }, allow_blank: true

  # Helper method
  def full_name
    "#{first_name} #{last_name}".strip
  end
end
