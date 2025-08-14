#!/bin/bash
set -euo pipefail

# Ensure BUILD_DIR is set
if [ -z "${BUILD_DIR:-}" ]; then
    echo "[ERROR] BUILD_DIR is not set. Please set it before running this script."
    exit 1
fi

echo "[INFO] Preparing build directory at: ${BUILD_DIR}"

# Create or clean the build directory
if [ -d "${BUILD_DIR}" ]; then
    echo "[INFO] Cleaning existing build directory..."
    rm -rf "${BUILD_DIR:?}/"*
else
    echo "[INFO] Creating build directory..."
    mkdir -p "${BUILD_DIR}"
fi

# Copy source files to the build directory, excluding unnecessary stuff
echo "[INFO] Copying source files to build directory..."
rsync -av --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='log' \
    --exclude='tmp' \
    --exclude='*.log' \
    ./ "${BUILD_DIR}/"

echo "[INFO] ✅ Build directory prepared successfully."
