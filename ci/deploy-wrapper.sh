#!/usr/bin/env bash
set -euo pipefail

TARGET=${1:-}

API_SERVER="${API_SERVER:-minato-api}"
API_USER="${API_USER:-minato}"

FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"
SERVICE_NAME="${SERVICE_NAME:-minato-backend}"
RUBY_VERSION="${RUBY_VERSION:-3.2.2}"

# Skip flags (default off)
SKIP_MIGRATIONS="${SKIP_MIGRATIONS:-0}"            # skips primary + queue DB migrations
SKIP_QUEUE_MIGRATIONS="${SKIP_QUEUE_MIGRATIONS:-0}" # skips only queue DB work

# ===== Required env from Jenkins withCredentials =====
: "${DB_HOST:?DB_HOST is not set}"
: "${MINATO_DATABASE_USERNAME:?MINATO_DATABASE_USERNAME is not set}"
: "${MINATO_DATABASE_PASSWORD:?MINATO_DATABASE_PASSWORD is not set}"
: "${SECRET_KEY_BASE:?SECRET_KEY_BASE is not set}"
# Optional but recommended when using credentials.yml.enc
RAILS_MASTER_KEY="${RAILS_MASTER_KEY:-}"

echo "[DEPLOY] Target host: ${API_SERVER}"
echo "[DEPLOY] DB host: ${DB_HOST}  DB user: ${MINATO_DATABASE_USERNAME}"
echo "[DEPLOY] SKIP_MIGRATIONS=${SKIP_MIGRATIONS}  SKIP_QUEUE_MIGRATIONS=${SKIP_QUEUE_MIGRATIONS}"

# ===== SSH options =====
RSYNC_SSH="ssh ${SSH_OPTIONS:-}"
SSH_CMD=(ssh)
[ -n "${SSH_OPTIONS:-}" ] && SSH_CMD=(ssh ${SSH_OPTIONS})

# ===== 1) Verify frontend build exists =====
if [ ! -d "./client/dist/spa" ] || [ ! -f "./client/dist/spa/index.html" ]; then
  echo "[ERROR] Frontend build directory ./client/dist/spa missing (or index.html not found)"
  exit 1
fi

# ===== 2) Ensure remote directories exist & ownership =====
echo "[DEPLOY] Ensuring remote directories exist..."
"${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" "mkdir -p '${FRONTEND_DIR}' '${BACKEND_DIR}'"

# ===== 3) Upload frontend (built SPA) =====
echo "[DEPLOY] Uploading frontend build..."
rsync -e "$RSYNC_SSH" -avz --delete \
  --chown="${API_USER}:${API_USER}" \
  ./client/dist/spa/ "${API_USER}@${API_SERVER}:${FRONTEND_DIR}/" \
  && echo "[DEPLOY] ✅ Frontend uploaded." \
  || { echo "[DEPLOY] ❌ Frontend upload failed."; exit 1; }

# ===== 4) Upload backend (source) =====
echo "[DEPLOY] Uploading backend source..."
rsync -e "$RSYNC_SSH" -avz --delete \
  --exclude=node_modules \
  --exclude=tmp \
  --exclude=log \
  --exclude=vendor/bundle \
  --chown="${API_USER}:${API_USER}" \
  ./ "${API_USER}@${API_SERVER}:${BACKEND_DIR}/" \
  && echo "[DEPLOY] ✅ Backend uploaded." \
  || { echo "[DEPLOY] ❌ Backend upload failed."; exit 1; }

# ===== 5) Install gems, maybe run DB tasks, precompile on remote =====
echo "[DEPLOY] Installing gems, DB tasks (conditional), and precompiling assets..."
"${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  RAILS_MASTER_KEY="${RAILS_MASTER_KEY}" \
  RUBY_VERSION="${RUBY_VERSION}" \
  BACKEND_DIR="${BACKEND_DIR}" \
  SERVICE_NAME="${SERVICE_NAME}" \
  SKIP_MIGRATIONS="${SKIP_MIGRATIONS}" \
  SKIP_QUEUE_MIGRATIONS="${SKIP_QUEUE_MIGRATIONS}" \
  'bash -s' <<'EOF'
set -euo pipefail

# ----- helpers -----
need() { command -v "$1" >/dev/null 2>&1 || { echo "[ERROR] '$1' not found"; exit 1; }; }

# ----- tooling sanity -----
export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
need bash
need sh
need rsync
need ruby || true
if ! command -v rbenv >/dev/null 2>&1; then
  echo "[ERROR] rbenv not found on remote host"
  exit 1
fi
eval "$(rbenv init - bash)"

# psql (optional; only needed if we touch DBs)
if [ "${SKIP_MIGRATIONS}" != "1" ] || [ "${SKIP_QUEUE_MIGRATIONS}" != "1" ]; then
  if ! command -v psql >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1 && command -v apt-get >/dev/null 2>&1; then
      echo "[REMOTE] Installing postgresql-client…"
      sudo apt-get update -y
      sudo apt-get install -y postgresql-client
    else
      echo "[WARN] psql not found and cannot auto-install; continuing (DB steps may be skipped)"
    fi
  fi
fi

cd "${BACKEND_DIR}"

# Use the requested Ruby
rbenv local "${RUBY_VERSION}" || true
rbenv rehash
echo "[REMOTE] Ruby:    $(ruby -v)"
echo "[REMOTE] Bundler: $(bundle -v || echo 'not installed')"
echo "[REMOTE] CWD:     $(pwd)"

# Match Bundler to Gemfile.lock (if pinned)
LOCK_BUNDLER="$(awk '/BUNDLED WITH/{getline; gsub(/^[ \t]+/,""); print; exit}' Gemfile.lock || true)"
CURR_BUNDLER="$(bundle -v 2>/dev/null | awk '{print $3}' || true)"
if [ -n "${LOCK_BUNDLER:-}" ] && [ "${LOCK_BUNDLER}" != "${CURR_BUNDLER}" ]; then
  echo "[REMOTE] Installing Bundler ${LOCK_BUNDLER}…"
  gem install "bundler:${LOCK_BUNDLER}" -N
  rbenv rehash
fi

# Make lockfile Linux-friendly (no-op if already set)
bundle lock --add-platform x86_64-linux || true

# Local bundler config
bundle config set --local path 'vendor/bundle'
bundle config set --local without 'development test'
bundle config set --local deployment 'true'

echo "[REMOTE] bundle install…"
bundle install --jobs=4 --retry=3

# ----- DB work (conditional) -----
export PGPASSWORD="${MINATO_DATABASE_PASSWORD}"

# Queue database (only if not skipped)
if [ "${SKIP_MIGRATIONS}" = "1" ] || [ "${SKIP_QUEUE_MIGRATIONS}" = "1" ]; then
  echo "[REMOTE] Skipping queue DB creation/migrations (SKIP_MIGRATIONS=${SKIP_MIGRATIONS}, SKIP_QUEUE_MIGRATIONS=${SKIP_QUEUE_MIGRATIONS})."
else
  if command -v psql >/dev/null 2>&1; then
    psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
      -tc "SELECT 1 FROM pg_database WHERE datname='minato_queue_production'" | grep -q 1 || \
    psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
      -c "CREATE DATABASE minato_queue_production OWNER ${MINATO_DATABASE_USERNAME};" || true
    # If you have rake tasks like db:schema:load:queue / db:migrate:queue, call them here
    # (left out intentionally to avoid the AR config error you saw)
  else
    echo "[REMOTE][WARN] psql not available; cannot ensure queue DB exists."
  fi
fi

# Primary app DB
if [ "${SKIP_MIGRATIONS}" = "1" ]; then
  echo "[REMOTE] SKIP_MIGRATIONS=1 — skipping db:prepare / migrations."
else
  echo "[REMOTE] Running db:prepare…"
  RAILS_ENV=production \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  RAILS_MASTER_KEY="${RAILS_MASTER_KEY}" \
  bundle exec rails db:prepare
fi

# ----- Assets -----
echo "[REMOTE] Precompiling assets…"
RAILS_ENV=production \
DB_HOST="${DB_HOST}" \
MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
RAILS_MASTER_KEY="${RAILS_MASTER_KEY}" \
bundle exec rails assets:precompile

# ----- Restart service -----
echo "[REMOTE] Restarting ${SERVICE_NAME}.service…"
if command -v sudo >/dev/null 2>&1; then
  sudo systemctl restart "${SERVICE_NAME}"
else
  systemctl --user restart "${SERVICE_NAME}"
fi

echo "[REMOTE] Done."
EOF

# ===== 6) Optionally reload nginx if present (safe no-op otherwise) =====
echo "[DEPLOY] Checking for nginx to reload (optional)…"
if "${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" 'command -v nginx >/dev/null 2>&1'; then
  "${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" 'sudo systemctl reload nginx' \
    && echo "[DEPLOY] nginx reloaded." \
    || echo "[DEPLOY] nginx reload not available."
else
  echo "[DEPLOY] nginx not installed; skipping reload."
fi

# ===== 7) Post-deploy health check =====
echo "[DEPLOY] Running post-deploy health check..."
if "${SSH_CMD[@]}" "${API_USER}@${API_SERVER}" "curl -fsSL http://localhost:3000/api/health | grep -q '\"status\":\"ok\"'"; then
  echo "[DEPLOY] ✅ Backend health check passed."
else
  echo "[DEPLOY] ❌ Backend health check failed!"
  exit 1
fi

# ===== 8) Final status message =====
echo "[DEPLOY] ✅ Deployment completed!"
echo "[DEPLOY] Frontend:     http://${API_SERVER}/"
echo "[DEPLOY] Backend API:  http://${API_SERVER}:3000/api/v1/"
echo "[DEPLOY] Backend Admin: http://${API_SERVER}:3000/admin/"
