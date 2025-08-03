#!/bin/bash
set -e

# Always use correct Ruby
export PATH="$HOME/.rubies/ruby-3.2.2/bin:$PATH"

echo "[INFO] Ruby version: $(ruby -v)"
echo "[INFO] Gem version: $(gem -v)"

# Ensure PostgreSQL dev headers exist
if ! dpkg -s libpq-dev >/dev/null 2>&1; then
  echo "[INFO] Installing libpq-dev..."
  sudo apt-get update
  sudo apt-get install -y libpq-dev
fi

# Detect correct Bundler version from Gemfile.lock
BUNDLER_VERSION=$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1 | tr -d ' ')
echo "[INFO] Using Bundler version: $BUNDLER_VERSION"

# Install Bundler if missing
if ! gem list bundler -i -v "$BUNDLER_VERSION" >/dev/null 2>&1; then
  echo "[INFO] Installing bundler $BUNDLER_VERSION..."
  gem install bundler -v "$BUNDLER_VERSION"
fi

# Install gems without dev/test groups
bundle _${BUNDLER_VERSION}_ config set --local without 'development test'
bundle _${BUNDLER_VERSION}_ install

# Precompile Rails assets
bundle _${BUNDLER_VERSION}_ exec rake assets:precompile
echo "[INFO] Rails assets precompiled successfully."