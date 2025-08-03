#!/bin/bash
set -e
RUBY_VERSION=$1

# Force correct Ruby path
export PATH="$HOME/.rubies/ruby-3.2.2/bin:$PATH"

echo "[INFO] Using Ruby: $(ruby -v)"
echo "[INFO] Using Gem: $(gem -v)"

# Use matching Bundler version from Gemfile.lock
BUNDLER_VERSION=$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1 | tr -d ' ')
echo "[INFO] Using Bundler version: $BUNDLER_VERSION"

bundle _${BUNDLER_VERSION}_ config set --local without 'development test'
bundle _${BUNDLER_VERSION}_ install
bundle _${BUNDLER_VERSION}_ exec rake assets:precompile

echo "[INFO] Rails backend build completed."
echo "[INFO] Ruby version ${RUBY_VERSION} is installed."
echo "[INFO] Verifying Ruby environment..."