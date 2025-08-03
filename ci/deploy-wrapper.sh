#!/bin/bash
set -e
TARGET=$1

API_SERVER="minato-api"
API_USER="minato"
FRONTEND_DIR="/var/www/minato-frontend"
BACKEND_DIR="/var/www/minato-backend"

echo "[DEPLOY] Deploying Minato to ${API_SERVER}..."

# Deploy frontend
echo "[DEPLOY] Uploading frontend..."
rsync -avz --delete ./frontend/dist/ ${API_USER}@${API_SERVER}:${FRONTEND_DIR}

# Deploy backend
echo "[DEPLOY] Uploading backend..."
rsync -avz --delete ./backend/ ${API_USER}@${API_SERVER}:${BACKEND_DIR}

# Restart services on API server
echo "[DEPLOY] Restarting services..."
ssh ${API_USER}@${API_SERVER} "sudo systemctl restart minato-backend"
ssh ${API_USER}@${API_SERVER} "sudo systemctl restart minato-frontend"

echo "[DEPLOY] Deployment completed."
echo "[DEPLOY] Deployment to ${API_SERVER} completed successfully."