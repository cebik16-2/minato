#!/bin/bash
set -euo pipefail

NODE_VERSION="${1:-}"

if [ -z "$NODE_VERSION" ]; then
    echo "[ERROR] No Node.js version specified."
    exit 1
fi

echo "[INFO] Verifying Node.js environment for version ${NODE_VERSION}..."

# Load NVM if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "[INFO] Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
fi

# Check if Node is installed
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed."
    exit 1
fi

# Extract major.minor for comparison
INSTALLED_VERSION=$(node -v | sed 's/^v//')
REQUIRED_MAJOR_MINOR=$(echo "$NODE_VERSION" | cut -d. -f1,2)
INSTALLED_MAJOR_MINOR=$(echo "$INSTALLED_VERSION" | cut -d. -f1,2)

if [ "$INSTALLED_MAJOR_MINOR" != "$REQUIRED_MAJOR_MINOR" ]; then
    echo "[ERROR] Node.js version mismatch. Expected ${REQUIRED_MAJOR_MINOR}.x, got ${INSTALLED_VERSION}."
    exit 1
fi

echo "[INFO] Node.js ${INSTALLED_VERSION} matches ${REQUIRED_MAJOR_MINOR}.x"
echo "[INFO] npm version: $(npm -v)"
