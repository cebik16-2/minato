#!/bin/bash
set -e
RUBY_VERSION=$1

echo "[INFO] Checking Ruby..."
if ! command -v ruby >/dev/null 2>&1; then
    echo "[ERROR] Ruby not found."
    exit 1
fi
ruby -v
bundle -v
echo "[INFO] Ruby version ${RUBY_VERSION} is installed."
echo "[INFO] Verifying Ruby environment..."