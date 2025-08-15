#!/bin/bash
set -euo pipefail

TARGET=${1:-}

API_SERVER="${API_SERVER:-minato-api}"
API_USER="${API_USER:-minato}"

FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

# ===== Required env from Jenkins withCredentials =====
: "${DB_HOST:?DB_HOST is not set}"
: "${MINATO_DATABASE_USERNAME:?MINATO_DATABASE_USERNAME is not set}"
: "${MINATO_DATABASE_PASSWORD:?MINATO_DATABASE_PASSWORD is not set}"
: "${SECRET_KEY_BASE:?SECRET_KEY_BASE is not set}"

echo "[DEPLOY] Target host: ${API_SERVER}"
echo "[DEPLOY] DB host: ${DB_HOST}  DB user: ${MINATO_DATABASE_USERNAME}"

# ===== SSH options (optional) =====
# If Jenkins provides an SSH key, pass it in via SSH_OPTIONS (e.g. "-i $SSH_KEY -o StrictHostKeyChecking=no")
RSYNC_SSH="ssh ${SSH_OPTIONS:-}"
SSH_CMD=(ssh)
[ -n "${SSH_OPTIONS:-}" ] && SSH_CMD=(ssh ${SSH_OPTIONS})

# ===== 1) Verify frontend build exists =====
if [ ! -d "./client/dist/spa" ]; then
  echo "[ERROR] Frontend build directory ./client/dist/spa not found"
  exit 1
fi

# ===== 2) Ensure remote directories exist =====
echo "[DEPLOY] Ensuring remote directories exist..."
"${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" "mkdir -p '${FRONTEND_DIR}' '${BACKEND_DIR}'"

# ===== 3) Upload frontend (built SPA) =====
echo "[DEPLOY] Uploading frontend build..."
rsync -e "$RSYNC_SSH" -avz --delete ./client/dist/spa/ "${API_USER}@${API_SERVER}:${FRONTEND_DIR}" \
  && echo "[DEPLOY] ✅ Frontend uploaded." \
  || { echo "[DEPLOY] ❌ Frontend upload failed."; exit 1; }

# ===== 4) Upload backend (source) =====
echo "[DEPLOY] Uploading backend source..."
rsync -e "$RSYNC_SSH" -avz --delete \
  --exclude=node_modules \
  --exclude=tmp \
  --exclude=log \
  --exclude=vendor/bundle \
  ./ "${API_USER}@${API_SERVER}:${BACKEND_DIR}" \
  && echo "[DEPLOY] ✅ Backend uploaded." \
  || { echo "[DEPLOY] ❌ Backend upload failed."; exit 1; }

# ===== 5) Install gems, migrate, precompile (Ruby 3.2.2 via rbenv) =====
echo "[DEPLOY] Installing gems, migrating DB, and precompiling assets..."
"${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  'bash -s' <<'EOF'
set -euo pipefail

# Make rbenv available
export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
if ! command -v rbenv >/dev/null 2>&1; then
  echo "[ERROR] rbenv not found on remote host"
  exit 1
fi
eval "$(rbenv init - bash)"

cd /var/www/minato-backend

# Pin Ruby to 3.2.2 for this app
rbenv local 3.2.2 || true
rbenv rehash

echo "[REMOTE] Ruby:     $(ruby -v)"
echo "[REMOTE] Bundler:  $(bundle -v || echo 'not installed')"
echo "[REMOTE] CWD:      $(pwd)"

# Ensure queue DB (ignore if it exists)
export PGPASSWORD="${MINATO_DATABASE_PASSWORD}"
psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
  -tc "SELECT 1 FROM pg_database WHERE datname='minato_queue_production'" | grep -q 1 || \
psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
  -c "CREATE DATABASE minato_queue_production OWNER ${MINATO_DATABASE_USERNAME};" || true

# Local bundler config
bundle config set --local path 'vendor/bundle'
bundle config set --local without 'development test'

# Match Bundler to Gemfile.lock
LOCK_BUNDLER=$(awk '/BUNDLED WITH/{getline; gsub(/^[ \t]+/,""); print; exit}' Gemfile.lock || true)
CURR_BUNDLER=$(bundle -v 2>/dev/null | awk "{print \$3}" || true)
if [ -n "${LOCK_BUNDLER:-}" ] && [ "${LOCK_BUNDLER}" != "${CURR_BUNDLER}" ]; then
  echo "[REMOTE] Installing Bundler ${LOCK_BUNDLER} to match Gemfile.lock..."
  gem install bundler -v "${LOCK_BUNDLER}" --no-document
fi

# Install gems
bundle install --jobs=4 --retry=3

# Migrate
RUBYOPT= \
RAILS_ENV=production \
DB_HOST="${DB_HOST}" \
MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
bundle exec rake db:migrate

# Precompile assets
RUBYOPT= \
RAILS_ENV=production \
DB_HOST="${DB_HOST}" \
MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
bundle exec rails assets:precompile

# Restart backend service
echo "[REMOTE] Restarting minato-backend.service..."
if command -v sudo >/dev/null 2>&1; then
  sudo systemctl restart minato-backend
else
  systemctl --user restart minato-backend
fi

echo "[REMOTE] Done."
EOF

# ===== 6) Optionally reload nginx if present (safe no-op otherwise) =====
echo "[DEPLOY] Checking for nginx to reload (optional)..."
if "${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" 'command -v nginx >/dev/null 2>&1'; then
  "${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" 'sudo systemctl reload nginx' \
    && echo "[DEPLOY] nginx reloaded." \
    || echo "[DEPLOY] nginx reload not available."
else
  echo "[DEPLOY] nginx not installed; skipping reload."
fi

echo "[DEPLOY] ✅ Deployment completed!"
echo "[DEPLOY] Frontend:     http://${API_SERVER}/"
echo "[DEPLOY] Backend API:  http://${API_SERVER}:3000/api/v1/"
