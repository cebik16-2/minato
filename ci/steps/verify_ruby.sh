#!/bin/bash
set -euo pipefail

RUBY_VERSION="${1:-}"

if [ -z "$RUBY_VERSION" ]; then
    echo "[ERROR] No Ruby version specified."
    exit 1
fi

echo "[INFO] Verifying Ruby environment for version ${RUBY_VERSION}..."

# Load chruby or rbenv if available
if [ -s "$HOME/.rubies/$RUBY_VERSION/bin/ruby" ]; then
    export PATH="$HOME/.rubies/$RUBY_VERSION/bin:$PATH"
elif [ -s "$HOME/.rbenv/bin/rbenv" ]; then
    echo "[INFO] Loading rbenv..."
    eval "$($HOME/.rbenv/bin/rbenv init - bash)"
fi

# Check Ruby installation
if ! command -v ruby >/dev/null 2>&1; then
    echo "[ERROR] Ruby is not installed."
    exit 1
fi

# Compare only major.minor version
INSTALLED_VERSION=$(ruby -v | awk '{print $2}')
REQUIRED_MAJOR_MINOR=$(echo "$RUBY_VERSION" | cut -d. -f1,2)
INSTALLED_MAJOR_MINOR=$(echo "$INSTALLED_VERSION" | cut -d. -f1,2)

if [ "$INSTALLED_MAJOR_MINOR" != "$REQUIRED_MAJOR_MINOR" ]; then
    echo "[ERROR] Ruby version mismatch. Expected ${REQUIRED_MAJOR_MINOR}.x, got ${INSTALLED_VERSION}."
    exit 1
fi

echo "[INFO] Ruby ${INSTALLED_VERSION} matches ${REQUIRED_MAJOR_MINOR}.x"

# Check Bundler
if ! command -v bundle >/dev/null 2>&1; then
    echo "[ERROR] Bundler is not installed."
    exit 1
fi
echo "[INFO] Bundler version: $(bundle -v)"
