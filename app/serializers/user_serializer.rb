# Explicit allowlist of user fields that are safe to expose.
# Never add Devise recovery or lockable columns here
# (encrypted_password, reset_password_token, unlock_token, ...).
class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :first_name, :last_name, :city
end
