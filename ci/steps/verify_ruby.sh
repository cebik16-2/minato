#!/bin/bash
set -euo pipefail

EXPECTED_VERSION=$1
echo "[INFO] Verifying Ruby environment for version ${EXPECTED_VERSION}..."

# Load rbenv
export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"
eval "$(rbenv init - bash)"

# Switch to expected version
rbenv shell "${EXPECTED_VERSION}" || {
    echo "[ERROR] Ruby ${EXPECTED_VERSION} not installed. Installing..."
    rbenv install -s "${EXPECTED_VERSION}"
    rbenv shell "${EXPECTED_VERSION}"
}

# Verify version
CURRENT_VERSION=$(ruby -e 'print RUBY_VERSION')
if [[ "$CURRENT_VERSION" != ${EXPECTED_VERSION%.*}* ]]; then
    echo "[ERROR] Ruby version mismatch. Expected ${EXPECTED_VERSION%.*}x, got $(ruby -v)."
    exit 1
fi

echo "[INFO] Ruby $(ruby -v) matches ${EXPECTED_VERSION%.*}x"
