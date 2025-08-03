#!/bin/bash
set -e

# Always use correct Ruby
export PATH="$HOME/.rubies/ruby-3.2.2/bin:$PATH"

# 🚀 Force production mode so debug/prelude isn't loaded
export RAILS_ENV=production
export NODE_ENV=production

echo "[INFO] Ruby version: $(ruby -v)"
echo "[INFO] Gem version: $(gem -v)"
echo "[INFO] Rails environment: $RAILS_ENV"

# Ensure PostgreSQL dev headers exist
if ! dpkg -s libpq-dev >/dev/null 2>&1; then
  echo "[INFO] Installing libpq-dev..."
  sudo apt-get update -y
  sudo apt-get install -y libpq-dev
fi

# Detect correct Bundler version from Gemfile.lock
BUNDLER_VERSION=$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1 | tr -d ' ')
if [ -z "$BUNDLER_VERSION" ]; then
  echo "[ERROR] Could not detect Bundler version from Gemfile.lock"
  exit 1
fi
echo "[INFO] Using Bundler version: $BUNDLER_VERSION"

# Install Bundler if missing
if ! gem list bundler -i -v "$BUNDLER_VERSION" >/dev/null 2>&1; then
  echo "[INFO] Installing bundler $BUNDLER_VERSION..."
  gem install bundler -v "$BUNDLER_VERSION"
fi

# Remove any leftover gems from previous builds (like debug)
echo "[INFO] Cleaning up old gems..."
bundle _${BUNDLER_VERSION}_ clean --force || true

# Install gems without dev/test groups
echo "[INFO] Installing production gems..."
bundle _${BUNDLER_VERSION}_ config set --local without 'development test'
bundle _${BUNDLER_VERSION}_ install --jobs=4 --retry=3

# Precompile Rails assets
echo "[INFO] Precompiling Rails assets..."
bundle _${BUNDLER_VERSION}_ exec rake assets:precompile

echo "[INFO] ✅ Rails backend build completed successfully."
echo "[INFO] Verifying Ruby environment..."