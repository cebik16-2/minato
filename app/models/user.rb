class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :confirmable, :lockable

  has_many :products, dependent: :destroy
  has_one_attached :profile_picture

  validates :first_name, :last_name, :country, :city, :address, :email, :phone, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, uniqueness: true, format: { with: /\A\+?[0-9]{10,15}\z/, message: "must be a valid phone number" }

  def full_name
    "#{first_name} #{last_name}"
  end
end
