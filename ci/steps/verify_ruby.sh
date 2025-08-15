#!/bin/bash
set -euo pipefail

EXPECTED_VERSION=$1
echo "[INFO] Verifying Ruby environment for version ${EXPECTED_VERSION}..."

# 🔹 Ensure rbenv paths are loaded
export RBENV_ROOT="$HOME/.rbenv"
export PATH="$RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH"
if ! command -v rbenv >/dev/null 2>&1; then
    echo "[ERROR] rbenv not found at $RBENV_ROOT/bin. Is it installed on this agent?"
    exit 1
fi
eval "$(rbenv init - bash)"

# 🔹 Ensure version is installed
if ! rbenv versions --bare | grep -qx "${EXPECTED_VERSION}"; then
    echo "[INFO] Installing Ruby ${EXPECTED_VERSION}..."
    rbenv install -s "${EXPECTED_VERSION}"
fi

# 🔹 Switch to correct version
rbenv shell "${EXPECTED_VERSION}"

# 🔹 Verify version
CURRENT_VERSION=$(ruby -e 'print RUBY_VERSION')
if [[ "$CURRENT_VERSION" != ${EXPECTED_VERSION%.*}* ]]; then
    echo "[ERROR] Ruby version mismatch. Expected ${EXPECTED_VERSION%.*}x, got $(ruby -v)."
    exit 1
fi

echo "[INFO] Ruby $(ruby -v) matches ${EXPECTED_VERSION%.*}x"
