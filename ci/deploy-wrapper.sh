#!/usr/bin/env bash
set -euo pipefail

TARGET=${1:-}

API_SERVER="${API_SERVER:-minato-api}"
API_USER="${API_USER:-minato}"

FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"
SERVICE_NAME="${SERVICE_NAME:-minato-backend}"
RUBY_VERSION="${RUBY_VERSION:-3.2.2}"

# Health/boot tuning
APP_PORT="${APP_PORT:-3000}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:${APP_PORT}/api/health}"
TRIES="${TRIES:-30}"
SLEEP="${SLEEP:-2}"

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

# ===== 2) Ensure remote directories exist =====
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
  --exclude=.git \
  --exclude=node_modules \
  --exclude=tmp \
  --exclude=log \
  --exclude=vendor/bundle \
  --chown="${API_USER}:${API_USER}" \
  ./ "${API_USER}@${API_SERVER}:${BACKEND_DIR}/" \
  && echo "[DEPLOY] ✅ Backend uploaded." \
  || { echo "[DEPLOY] ❌ Backend upload failed."; exit 1; }

# ===== 5) Install gems, run DB tasks, precompile on remote =====
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
  APP_PORT="${APP_PORT}" \
  HEALTH_URL="${HEALTH_URL}" \
  TRIES="${TRIES}" \
  SLEEP="${SLEEP}" \
  'bash -s' <<'EOF'
set -euo pipefail

# ----- helpers -----
need() { command -v "$1" >/dev/null 2>&1 || { echo "[ERROR] '$1' not found"; exit 1; }; }

# ----- tooling sanity -----
export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
need bash; need sh; need rsync
command -v rbenv >/dev/null 2>&1 || { echo "[ERROR] rbenv not found on remote host"; exit 1; }
eval "$(rbenv init - bash)"

# Detect passwordless sudo availability (for restart/nginx only)
if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
  SUDO_OK=1
else
  SUDO_OK=0
fi

cd "${BACKEND_DIR}"

# Ensure writable dirs (no sudo needed)
mkdir -p tmp/pids tmp/sockets log

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

# Local bundler config (avoid deprecated --path)
bundle config set --local path 'vendor/bundle'
bundle config set --local without 'development test'
bundle config set --local deployment 'true'

echo "[REMOTE] bundle install…"
bundle install --jobs=4 --retry=3

# ----- DB work (conditional; NO apt-get here) -----
export PGPASSWORD="${MINATO_DATABASE_PASSWORD}"

# Queue DB ensure + migrate (non-destructive)
if [ "${SKIP_MIGRATIONS}" = "1" ] || [ "${SKIP_QUEUE_MIGRATIONS}" = "1" ]; then
  echo "[REMOTE] Skipping queue DB migrations (SKIP_MIGRATIONS=${SKIP_MIGRATIONS}, SKIP_QUEUE_MIGRATIONS=${SKIP_QUEUE_MIGRATIONS})."
else
  if command -v psql >/dev/null 2>&1; then
    if ! psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres -tc \
         "SELECT 1 FROM pg_database WHERE datname='minato_queue_production'" | grep -q 1; then
      echo "[REMOTE] Creating queue DB 'minato_queue_production'…"
      psql -U "${MINATO_DATABASE_USERNAME}" -h "${DB_HOST}" -d postgres \
        -c "CREATE DATABASE minato_queue_production OWNER ${MINATO_DATABASE_USERNAME};" || true
    fi
  else
    echo "[REMOTE][WARN] psql not available; cannot ensure queue DB exists."
  fi

  echo "[REMOTE] Running db:migrate:queue…"
  RAILS_ENV=production \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  RAILS_MASTER_KEY="${RAILS_MASTER_KEY}" \
  bundle exec rails db:migrate:queue
fi

# Primary app DB (app migrations only)
if [ "${SKIP_MIGRATIONS}" = "1" ]; then
  echo "[REMOTE] SKIP_MIGRATIONS=1 — skipping primary migrations."
else
  echo "[REMOTE] Running db:migrate:primary…"
  RAILS_ENV=production \
  DB_HOST="${DB_HOST}" \
  MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}" \
  MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}" \
  SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  RAILS_MASTER_KEY="${RAILS_MASTER_KEY}" \
  bundle exec rails db:migrate:primary
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

# ----- Restart service + wait active (sudo -n; exact paths) -----
echo "[REMOTE] Restarting ${SERVICE_NAME}.service…"
if [ "$SUDO_OK" = "1" ]; then
  sudo -n /usr/bin/systemctl restart "${SERVICE_NAME}"
elif systemctl --user status "${SERVICE_NAME}" >/dev/null 2>&1; then
  systemctl --user restart "${SERVICE_NAME}"
else
  echo "[REMOTE][ERROR] Need passwordless sudo for /usr/bin/systemctl restart ${SERVICE_NAME}"
  exit 1
fi

echo "[REMOTE] Waiting for systemd to report 'active'…"
for i in $(seq 1 "${TRIES}"); do
  /usr/bin/systemctl is-active --quiet "${SERVICE_NAME}" && { echo "[REMOTE] Service is active (try $i/${TRIES})."; break; }
  echo "[REMOTE] … not active yet (try $i/${TRIES}). Sleeping ${SLEEP}s."
  sleep "${SLEEP}"
  if [ "$i" -eq "${TRIES}" ]; then
    echo "[REMOTE] ❌ Service failed to become active. Recent logs:"
    ( [ "$SUDO_OK" = "1" ] && sudo -n /usr/bin/journalctl -u "${SERVICE_NAME}" -n 200 --no-pager ) || \
      /usr/bin/journalctl -u "${SERVICE_NAME}" -n 200 --no-pager || true
    exit 1
  fi
done

# ----- Optional nginx reload (NOPASSWD required) -----
if command -v nginx >/dev/null 2>&1; then
  if [ "$SUDO_OK" = "1" ] && sudo -n /usr/sbin/nginx -t >/dev/null 2>&1; then
    sudo -n /usr/bin/systemctl reload nginx || true
    echo "[REMOTE] nginx reloaded."
  else
    echo "[REMOTE] nginx reload not available (needs NOPASSWD)."
  fi
fi

# ----- Robust health check (retry; fallback to /) -----
echo "[REMOTE] Probing ${HEALTH_URL}…"
READY=
for i in $(seq 1 "${TRIES}"); do
  if curl -sf --max-time 2 "${HEALTH_URL}" >/dev/null; then
    echo "[REMOTE] ✅ Health OK (try $i/${TRIES})."
    READY=1; break
  fi
  if curl -sf --max-time 2 "http://127.0.0.1:${APP_PORT}" >/dev/null; then
    echo "[REMOTE] ✅ Root responded (try $i/${TRIES})."
    READY=1; break
  fi
  echo "[REMOTE] … not ready yet (try $i/${TRIES}). Sleeping ${SLEEP}s."
  sleep "${SLEEP}"
done

if [ -z "${READY:-}" ]; then
  echo "[REMOTE] ❌ Health check failed after $((TRIES*SLEEP))s. Recent logs:"
  ( [ "$SUDO_OK" = "1" ] && sudo -n /usr/bin/journalctl -u "${SERVICE_NAME}" -n 200 --no-pager ) || \
    /usr/bin/journalctl -u "${SERVICE_NAME}" -n 200 --no-pager || true
  exit 1
fi

echo "[REMOTE] Done."
EOF

# ===== 6) Final status message =====
echo "[DEPLOY] ✅ Deployment completed!"
echo "[DEPLOY] Frontend:      http://${API_SERVER}/"
echo "[DEPLOY] Backend API:   http://${API_SERVER}:3000/api/v1/"
echo "[DEPLOY] Health target: ${HEALTH_URL}"
