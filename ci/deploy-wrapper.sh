#!/bin/bash
set -euo pipefail

TARGET=${1:-}

API_SERVER="minato-api"
API_USER="minato"

# Deployment directories on API server
FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

# Ensure DB variables are present
: "${DB_HOST:?DB_HOST is not set}"
: "${MINATO_DATABASE_USERNAME:?MINATO_DATABASE_USERNAME is not set}"
: "${MINATO_DATABASE_PASSWORD:?MINATO_DATABASE_PASSWORD is not set}"

echo "[DEPLOY] Deploying Minato to ${API_SERVER}..."
echo "[DEPLOY] Using DB host: ${DB_HOST}, user: ${MINATO_DATABASE_USERNAME}"

# 1) Frontend
if [ ! -d "./client/dist/spa" ]; then
  echo "[ERROR] Frontend build directory ./client/dist/spa not found!"
  exit 1
fi

echo "[DEPLOY] Uploading frontend build..."
rsync -avz --delete ./client/dist/spa/ "${API_USER}@${API_SERVER}:${FRONTEND_DIR}" \
  && echo "[DEPLOY] ✅ Frontend uploaded successfully." \
  || { echo "[DEPLOY] ❌ Frontend upload failed."; exit 1; }

# 2) Backend
echo "[DEPLOY] Uploading backend..."
rsync -avz --delete \
  --exclude=node_modules \
  --exclude=tmp \
  --exclude=log \
  ./ "${API_USER}@${API_SERVER}:${BACKEND_DIR}" \
  && echo "[DEPLOY] ✅ Backend uploaded successfully." \
  || { echo "[DEPLOY] ❌ Backend upload failed."; exit 1; }

# 3) Ensure queue DB exists, install gems & run migrations
echo "[DEPLOY] Preparing database and installing gems..."
ssh "${API_USER}@${API_SERVER}" <<EOF
  set -euo pipefail

  # Use rbenv Ruby 3.2.2
  if [ -x "\$HOME/.rbenv/bin/rbenv" ]; then
    export RBENV_ROOT="\$HOME/.rbenv"
    export PATH="\$RBENV_ROOT/bin:\$PATH"
    eval "\$(rbenv init - bash)"
    rbenv shell 3.2.2 || rbenv local 3.2.2
    rbenv rehash
  fi

  cd "${BACKEND_DIR}"

  # Verify Ruby
  ruby -v
  bundle -v || true

  # DB env (injected from local)
  export DB_HOST="${DB_HOST}"
  export MINATO_DATABASE_USERNAME="${MINATO_DATABASE_USERNAME}"
  export MINATO_DATABASE_PASSWORD="${MINATO_DATABASE_PASSWORD}"
  export PGPASSWORD="${MINATO_DATABASE_PASSWORD}"

  # Ensure Solid Queue DB exists
  psql -U "\$MINATO_DATABASE_USERNAME" -h "\$DB_HOST" -d postgres \
    -tc "SELECT 1 FROM pg_database WHERE datname='minato_queue_production'" | grep -q 1 || \
  psql -U "\$MINATO_DATABASE_USERNAME" -h "\$DB_HOST" -d postgres \
    -c "CREATE DATABASE minato_queue_production OWNER \$MINATO_DATABASE_USERNAME;"

  # Bundle install (production only)
  bundle config set --local path vendor/bundle
  bundle config set --local without 'development test'
  bundle install --jobs=4 --retry=3

  # Migrate
  RAILS_ENV=production bundle exec rake db:migrate
EOF

# 4) Precompile assets
echo "[DEPLOY] Precompiling backend assets..."
ssh "${API_USER}@${API_SERVER}" <<EOF
  set -euo pipefail

  if [ -x "\$HOME/.rbenv/bin/rbenv" ]; then
    export RBENV_ROOT="\$HOME/.rbenv"
    export PATH="\$RBENV_ROOT/bin:\$PATH"
    eval "\$(rbenv init - bash)"
    rbenv shell 3.2.2 || rbenv local 3.2.2
    rbenv rehash
  fi

  cd "${BACKEND_DIR}"
  RAILS_ENV=production bundle exec rails assets:precompile
EOF

# 5) Restart services
echo "[DEPLOY] Restarting services..."
ssh "${API_USER}@${API_SERVER}" "systemctl restart minato-backend" || { echo "[DEPLOY] ❌ Failed to restart backend."; exit 1; }
ssh "${API_USER}@${API_SERVER}" "systemctl restart minato-frontend" || { echo "[DEPLOY] ❌ Failed to restart frontend."; exit 1; }

echo "[DEPLOY] ✅ Deployment completed successfully!"
echo "[DEPLOY] Frontend: http://${API_SERVER}/"
echo "[DEPLOY] Backend API: http://${API_SERVER}/api/v1/"
