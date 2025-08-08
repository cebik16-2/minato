#!/bin/bash
set -euo pipefail

TARGET=${1:-}

API_SERVER="minato-api"
API_USER="minato"

# Deployment directories on API server
FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

echo "[DEPLOY] Deploying Minato to ${API_SERVER}..."

# 1️⃣ Deploy frontend
if [ ! -d "./client/dist/spa" ]; then
    echo "[ERROR] Frontend build directory ./client/dist/spa not found!"
    exit 1
fi

echo "[DEPLOY] Uploading frontend build..."
if rsync -avz --delete ./client/dist/spa/ ${API_USER}@${API_SERVER}:${FRONTEND_DIR}; then
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
    ./ ${API_USER}@${API_SERVER}:${BACKEND_DIR}; then
    echo "[DEPLOY] ✅ Backend uploaded successfully."
else
    echo "[DEPLOY] ❌ Backend upload failed."
    exit 1
fi

# 3️⃣ Run DB migrations
echo "[DEPLOY] Running database migrations..."
if ssh ${API_USER}@${API_SERVER} "cd ${BACKEND_DIR} && \
    export PATH=\$HOME/.rubies/ruby-3.2.2/bin:\$PATH && \
    bundle exec rake db:migrate RAILS_ENV=production"; then
    echo "[DEPLOY] ✅ Migrations ran successfully."
else
    echo "[DEPLOY] ❌ Migrations failed."
    exit 1
fi

# 4️⃣ Restart services
echo "[DEPLOY] Restarting services..."
ssh ${API_USER}@${API_SERVER} "systemctl restart minato-backend" || {
    echo "[DEPLOY] ❌ Failed to restart minato-backend."
    exit 1
}
ssh ${API_USER}@${API_SERVER} "systemctl restart minato-frontend" || {
    echo "[DEPLOY] ❌ Failed to restart minato-frontend."
    exit 1
}

# ✅ Final confirmation
echo "[DEPLOY] ✅ Deployment completed successfully!"
echo "[DEPLOY] Frontend available at: http://${API_SERVER}/"
echo "[DEPLOY] Backend API available at: http://${API_SERVER}/api/v1/"

exit 0
