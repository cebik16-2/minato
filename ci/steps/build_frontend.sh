#!/bin/bash
set -euo pipefail

NODE_VERSION=${1:?Node version not provided}

echo "[INFO] Building Vue.js (Quasar) frontend..."
echo "[INFO] Target Node.js version: ${NODE_VERSION}"

# Verify Node.js version using NVM if available
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install "${NODE_VERSION}"
    nvm use "${NODE_VERSION}"
fi

# Check Node.js & npm versions
echo "[INFO] Node.js: $(node -v)"
echo "[INFO] npm: $(npm -v)"

# Go to client directory and check if package.json exists
if [ ! -f "client/package.json" ]; then
    echo "[ERROR] No package.json found in ./client — wrong directory?"
    exit 1
fi

cd client

# Clean install dependencies
echo "[INFO] Installing frontend dependencies..."
npm ci

# Build for production
echo "[INFO] Building frontend with Quasar..."
NODE_ENV=production npm run build

cd ..

# Verify build output
if [ ! -d "client/dist/spa" ]; then
    echo "[ERROR] Frontend build output not found in client/dist/spa"
    exit 1
fi

echo "[INFO] Vue.js frontend build completed successfully."
