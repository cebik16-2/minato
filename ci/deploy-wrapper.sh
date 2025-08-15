#!/bin/bash
set -euo pipefail

TARGET=${1:-}

API_SERVER="minato-api"
API_USER="minato"

# Deployment directories on API server
FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

# Ensure required env is present (export these in Jenkins withCredentials)
: "${DB_HOST:?DB_HOST is not set}"
: "${MINATO_DATABASE_USERNAME:?MINATO_DATABASE_USERNAME is not set}"
: "${MINATO_DATABASE_PASSWORD:?MINATO_DATABASE_PASSWORD is not set}"
: "${SECRET_KEY_BASE:?SECRET_KEY_BASE is not set}"

echo "[DEPLOY] Deploying Minato to ${API_SERVER}..."
echo "[DEPLOY] Using DB host: ${DB_HOST}, user: ${MINATO_DATABASE_USERNAME}"

# 1) Upload frontend (built SPA)
if [ ! -d "./client/dist/spa" ]; then
  echo "[ERROR] Frontend build directory ./client/dist/spa not found!"
  exit 1
fi

echo "[DEPLOY] Uploading frontend build..."
rsync -avz --delete ./client/dist/spa/ "${API_USER}@${API_SERVER}:${FRONTEND_DIR}" \
  && echo "[DEPLOY] Frontend uploaded successfully." \
  || { echo "[DEPLOY] Frontend upload failed."; exit 1; }

# 2) Upload backend
echo "[DEPLOY] Uploading backend..."
rsync -avz --delete \
  --exclude=node_modules \
  --exclude=tmp \
  --exclude=log \
  ./ "${API_USER}@${API_SERVER}:${BACKEND_DIR}" \
  && echo "[DEPLOY] Backend uploaded successfully." \
  || { echo "[DEPLOY] Backend upload failed."; exit 1; }

# 3) Install gems & run migrations (Ruby 3.2.2 via rbenv) + ensure queue DB
echo "[DEPLOY] Preparing database and installing gems..."
ssh -o LogLevel=ERROR "${API_USER}@${API_SERVER}" \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  'bash -s' <<'EOF'
set -euo pipefail

export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
eval "$(rbenv init - bash)"

cd /var/www/minato-backend
rbenv local 3.2.2
rbenv rehash

# Sanity checks
echo "[INFO] Ruby:  $(ruby -v)"
echo "[INFO] Which bundle: $(command -v bundle || true)"

# Make sure DB exists (queue DB used by Solid Queue if separate)
export PGPASSWORD="${MINATO_DATABASE_PASSWORD}"
psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
  -tc "SELECT 1 FROM pg_database WHERE datname='minato_queue_production'" | grep -q 1 || \
psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
  -c "CREATE DATABASE minato_queue_production OWNER ${MINATO_DATABASE_USERNAME};"

# Use project-local bundler config (no global writes)
bundle config set --local path 'vendor/bundle'
bundle config set --local without 'development test'

# Ensure we run with the lockfile's Bundler version if different
LOCK_BUNDLER=$(awk '/BUNDLED WITH/{getline; gsub(/^[ \t]+/,""); print; exit}' Gemfile.lock)
if [ -n "${LOCK_BUNDLER:-}" ] && [ "${LOCK_BUNDLER}" != "$(bundle -v | awk "{print \$3}")" ]; then
  echo "[INFO] Installing Bundler ${LOCK_BUNDLER} to match Gemfile.lock..."
  gem install bundler -v "${LOCK_BUNDLER}" --no-document
fi

# Install gems
bundle install --jobs=4 --retry=3

# Run migrations with required env vars
RAILS_ENV=production \
DB_HOST="${DB_HOST}" \
MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
bundle exec rake db:migrate
EOF

# 4) Precompile assets (same Ruby) and export env
echo "[DEPLOY] Precompiling backend assets..."
ssh -o LogLevel=ERROR "${API_USER}@${API_SERVER}" \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  'bash -s' <<'EOF'
set -euo pipefail

export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
eval "$(rbenv init - bash)"

cd /var/www/minato-backend
rbenv local 3.2.2
rbenv rehash

RAILS_ENV=production \
DB_HOST="${DB_HOST}" \
MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
bundle exec rails assets:precompile
EOF

# 5) Restart services
echo "[DEPLOY] Restarting services..."
ssh -o LogLevel=ERROR "${API_USER}@${API_SERVER}" "sudo systemctl restart minato-backend" \
  || { echo "[DEPLOY] Failed to restart backend."; exit 1; }

# For the frontend (static under Nginx), reload Nginx:
ssh -o LogLevel=ERROR "${API_USER}@${API_SERVER}" "sudo systemctl reload nginx" \
  || echo "[DEPLOY]  Nginx reload failed (check if Nginx manages the frontend)."

echo "[DEPLOY]  Deployment completed successfully!"
echo "[DEPLOY] Frontend: http://${API_SERVER}/"
echo "[DEPLOY] Backend API: http://${API_SERVER}/api/v1/"
