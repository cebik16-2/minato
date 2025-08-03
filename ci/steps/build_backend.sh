#!/bin/bash
set -e
RUBY_VERSION=$1

echo "[INFO] Building Rails backend..."
bundle install --without development test
bundle exec rake assets:precompile

echo "[INFO] Rails backend build completed."
echo "[INFO] Ruby version ${RUBY_VERSION} is installed."
echo "[INFO] Verifying Ruby environment..."