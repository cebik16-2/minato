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

# 1️⃣ Deploy frontend
if [ ! -d "./client/dist/spa" ]; then
    echo "[ERROR] Frontend build directory ./client/dist/spa not found!"
    exit 1
fi

echo "[DEPLOY] Uploading frontend build..."
if rsync -avz --delete ./client/dist/spa/ "${API_USER}@${API_SERVER}:${FRONTEND_DIR}"; then
    echo "[DEPLOY] ✅ Frontend uploaded successfully."
else
    echo "[DEPLOY] ❌ Frontend upload failed."
    exit 1
fi

# 2️⃣ Deploy backend
echo "[DEPLOY] Uploading backend..."
if rsync -avz --delete \
    --exclude=node_modules \
    --exclude=tmp \
    --exclude=log \
    ./ "${API_USER}@${API_SERVER}:${BACKEND_DIR}"; then
    echo "[DEPLOY] ✅ Backend uploaded successfully."
else
    echo "[DEPLOY] ❌ Backend upload failed."
    exit 1
fi

# 3️⃣ Ensure queue DB exists, install gems & run migrations
echo "[DEPLOY] Preparing database and installing gems..."
ssh ${API_USER}@${API_SERVER} bash -s <<EOF
    set -euo pipefail
    export PATH=\$HOME/.rubies/ruby-3.0.2/bin:\$PATH
    export DB_HOST='${DB_HOST}'
    export MINATO_DATABASE_USERNAME='${MINATO_DATABASE_USERNAME}'
    export MINATO_DATABASE_PASSWORD='${MINATO_DATABASE_PASSWORD}'
    export PGPASSWORD='${MINATO_DATABASE_PASSWORD}'

    echo "[INFO] Ruby version: \$(ruby -v)"
    echo "[INFO] Bundler version: \$(bundle -v)"

    # Ensure DB exists
    psql -U \${MINATO_DATABASE_USERNAME} -h \${DB_HOST} -d postgres \
        -tc "SELECT 1 FROM pg_database WHERE datname='minato_queue_production'" | grep -q 1 || \
        psql -U \${MINATO_DATABASE_USERNAME} -h \${DB_HOST} -d postgres \
            -c "CREATE DATABASE minato_queue_production OWNER \${MINATO_DATABASE_USERNAME};"

    cd ${BACKEND_DIR}

    # Install correct gems for Ruby 3.0.2
    bundle install --deployment --without development test

    # Run migrations
    bundle exec rake db:migrate RAILS_ENV=production
EOF

# 4️⃣ Precompile assets
echo "[DEPLOY] Precompiling backend assets..."
ssh ${API_USER}@${API_SERVER} bash -s <<EOF
    set -euo pipefail
    export PATH=\$HOME/.rubies/ruby-3.0.2/bin:\$PATH
    export DB_HOST='${DB_HOST}'
    export MINATO_DATABASE_USERNAME='${MINATO_DATABASE_USERNAME}'
    export MINATO_DATABASE_PASSWORD='${MINATO_DATABASE_PASSWORD}'

    cd ${BACKEND_DIR}
    bundle exec rails assets:precompile RAILS_ENV=production
EOF

# 5️⃣ Restart services
echo "[DEPLOY] Restarting services..."
ssh ${API_USER}@${API_SERVER} "systemctl restart minato-backend" || { echo "[DEPLOY] ❌ Failed to restart backend."; exit 1; }
ssh ${API_USER}@${API_SERVER} "systemctl restart minato-frontend" || { echo "[DEPLOY] ❌ Failed to restart frontend."; exit 1; }

# ✅ Final confirmation
echo "[DEPLOY] ✅ Deployment completed successfully!"
echo "[DEPLOY] Frontend available at: http://${API_SERVER}/"
echo "[DEPLOY] Backend API available at: http://${API_SERVER}/api/v1/"
