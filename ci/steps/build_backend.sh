#!/bin/bash
set -euo pipefail

# Ensure DB variables exist (needed for Rails to connect during build)
: "${DB_HOST:?DB_HOST is not set}"
: "${MINATO_DATABASE_USERNAME:?MINATO_DATABASE_USERNAME is not set}"
: "${MINATO_DATABASE_PASSWORD:?MINATO_DATABASE_PASSWORD is not set}"

# Set Ruby paths and environments
export PATH="$HOME/.rubies/ruby-3.2.2/bin:$PATH"
export RAILS_ENV=production
export NODE_ENV=production

echo "[INFO] Ruby version: $(ruby -v)"
echo "[INFO] Gem version: $(gem -v)"
echo "[INFO] Rails environment: $RAILS_ENV"

# Ensure PostgreSQL headers are installed
if ! dpkg -s libpq-dev >/dev/null 2>&1; then
  echo "[INFO] Installing libpq-dev..."
  sudo apt-get update -y
  sudo apt-get install -y libpq-dev
fi

# Detect Bundler version from Gemfile.lock
BUNDLER_VERSION=$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1 | tr -d ' ')
if [ -z "$BUNDLER_VERSION" ]; then
  echo "[ERROR] Could not detect Bundler version from Gemfile.lock"
  exit 1
fi
echo "[INFO] Using Bundler version: $BUNDLER_VERSION"

# Install matching Bundler if missing
if ! gem list bundler -i -v "$BUNDLER_VERSION" >/dev/null 2>&1; then
  echo "[INFO] Installing bundler $BUNDLER_VERSION..."
  gem install bundler -v "$BUNDLER_VERSION"
fi

# Clean old or broken gemspecs
echo "[INFO] Cleaning up old gems..."
bundle _${BUNDLER_VERSION}_ clean --force || true

# Install production gems
echo "[INFO] Installing production gems..."
bundle _${BUNDLER_VERSION}_ config set without 'development test'
bundle _${BUNDLER_VERSION}_ install --jobs=4 --retry=3

# Ensure SECRET_KEY_BASE is set
if [ -z "${SECRET_KEY_BASE:-}" ]; then
  echo "[INFO] Generating temporary SECRET_KEY_BASE..."
  export SECRET_KEY_BASE=$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')
fi
echo "[INFO] Using SECRET_KEY_BASE: ${SECRET_KEY_BASE:0:8}********"

# Export DB vars for build
export DB_HOST="$DB_HOST"
export MINATO_DATABASE_USERNAME="$MINATO_DATABASE_USERNAME"
export MINATO_DATABASE_PASSWORD="$MINATO_DATABASE_PASSWORD"

# Precompile Rails assets
echo "[INFO] Precompiling Rails assets..."
bundle _${BUNDLER_VERSION}_ exec rake assets:precompile

echo "[INFO] Rails backend build completed successfully."
