#!/bin/bash
set -e
NODE_VERSION=$1

echo "[INFO] Building Vue.js frontend..."
cd frontend
npm ci
npm run build
cd ..
echo "[INFO] Vue.js frontend build completed."
echo "[INFO] Node.js version ${NODE_VERSION} is installed."
echo "[INFO] Verifying Node.js environment..."