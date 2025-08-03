#!/bin/bash
set -e
NODE_VERSION=$1

echo "[INFO] Checking Node.js..."
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js not found."
    exit 1
fi
node -v
npm -v
