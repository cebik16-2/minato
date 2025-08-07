#!/bin/bash
set -e

# 🔧 Set paths and env
export PATH="$HOME/.rubies/ruby-3.2.2/bin:$PATH"
export RAILS_ENV=production
export NODE_ENV=production

echo "[INFO] Ruby version: $(ruby -v)"
echo "[INFO] Gem version: $(gem -v)"
echo "[INFO] Rails environment: $RAILS_ENV"

# Ensure PostgreSQL headers exist
if ! dpkg -s libpq-dev >/dev/null 2>&1; then
  echo "[INFO] Installing libpq-dev..."
  sudo apt-get update -y
  sudo apt-get install -y libpq-dev
fi

# Determine Bundler version from Gemfile.lock
BUNDLER_VERSION=$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1 | tr -d ' ')
if [ -z "$BUNDLER_VERSION" ]; then
  echo "[ERROR] Could not detect Bundler version from Gemfile.lock"
  exit 1
fi
echo "[INFO] Using Bundler version: $BUNDLER_VERSION"

# Install matching bundler if not present
if ! gem list bundler -i -v "$BUNDLER_VERSION" >/dev/null 2>&1; then
  echo "[INFO] Installing bundler $BUNDLER_VERSION..."
  gem install bundler -v "$BUNDLER_VERSION"
fi

# Clean up any broken gemspecs
echo "[INFO] Cleaning up old gems..."
bundle _${BUNDLER_VERSION}_ clean --force || true

# Install production gems
echo "[INFO] Installing production gems..."
bundle _${BUNDLER_VERSION}_ config set --local without 'development test'
bundle _${BUNDLER_VERSION}_ install --jobs=4 --retry=3

# Install JS deps and run JS build (vite)
echo "[INFO] Installing JS dependencies..."
yarn install

echo "[INFO] Building JS using local vite..."
export PATH="./node_modules/.bin:$PATH"
yarn build

# Generate a SECRET_KEY_BASE if not already set
if [ -z "$SECRET_KEY_BASE" ]; then
  echo "[INFO] Generating temporary SECRET_KEY_BASE for build..."
  export SECRET_KEY_BASE=$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')
fi
echo "[INFO] Using SECRET_KEY_BASE: ${SECRET_KEY_BASE:0:8}********"

# Precompile Rails assets (this will now work since vite already ran)
echo "[INFO] Precompiling Rails assets..."
bundle _${BUNDLER_VERSION}_ exec rake assets:precompile

echo "[INFO] ✅ Rails backend build completed successfully."
