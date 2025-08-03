#!/bin/bash
set -e

TARGET=$1

API_SERVER="minato-api"
API_USER="minato"

# Deployment directories on API server
FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

echo "[DEPLOY] Deploying Minato to ${API_SERVER}..."

# 1️⃣ Deploy frontend (Quasar SPA build)
# Quasar outputs build to client/dist/spa
if [ ! -d "./client/dist/spa" ]; then
    echo "[ERROR] Frontend build directory ./client/dist/spa not found!"
    exit 1
fi

echo "[DEPLOY] Uploading frontend build..."
rsync -avz --delete ./client/dist/spa/ ${API_USER}@${API_SERVER}:${FRONTEND_DIR}

# 2️⃣ Deploy backend (Rails app from repo root)
echo "[DEPLOY] Uploading backend..."
rsync -avz --delete \
    --exclude=node_modules \
    --exclude=tmp \
    --exclude=log \
    ./ ${API_USER}@${API_SERVER}:${BACKEND_DIR}

# 3️⃣ Run DB migrations (optional but recommended)
echo "[DEPLOY] Running database migrations..."
ssh ${API_USER}@${API_SERVER} "cd ${BACKEND_DIR} && \
    export PATH=\$HOME/.rubies/ruby-3.2.2/bin:\$PATH && \
    bundle exec rake db:migrate RAILS_ENV=production"

# 4️⃣ Restart services
echo "[DEPLOY] Restarting services..."
ssh ${API_USER}@${API_SERVER} "sudo systemctl restart minato-backend"
ssh ${API_USER}@${API_SERVER} "sudo systemctl restart minato-frontend"

# 5️⃣ Clear caches
echo "[DEPLOY] Deployment completed."
echo "[DEPLOY] Minato is now live on ${API_SERVER}!"
echo "[DEPLOY] Frontend is available at http://${API_SERVER}/"
echo "[DEPLOY] Backend API is available at http://${API_SERVER}/api/v1/"