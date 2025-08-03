#!/bin/bash
set -e
TARGET=$1

API_SERVER="minato-api"
API_USER="minato"

# These are the target directories on the API server
FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

echo "[DEPLOY] Deploying Minato to ${API_SERVER}..."

# 1️⃣ Deploy frontend (Quasar build output)
echo "[DEPLOY] Uploading frontend build..."
rsync -avz --delete ./client/dist/spa/ ${API_USER}@${API_SERVER}:${FRONTEND_DIR}

# 2️⃣ Deploy backend (Rails app)
echo "[DEPLOY] Uploading backend..."
# We exclude node_modules and tmp to speed up sync
rsync -avz --delete \
    --exclude=node_modules \
    --exclude=tmp \
    ./ ${API_USER}@${API_SERVER}:${BACKEND_DIR}

# 3️⃣ Restart services on API server
echo "[DEPLOY] Restarting services..."
ssh ${API_USER}@${API_SERVER} "sudo systemctl restart minato-backend"
ssh ${API_USER}@${API_SERVER} "sudo systemctl restart minato-frontend"

echo "[DEPLOY] Deployment completed."
echo "[DEPLOY] Minato is now live on ${API_SERVER}!"
echo "[DEPLOY] Frontend is available at http://${API_SERVER}/"
echo "[DEPLOY] Backend API is available at http://${API_SERVER}/api/v1/"