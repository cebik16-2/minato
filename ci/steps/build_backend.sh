#!/bin/bash
set -euo pipefail

RUBY_VERSION="${1:-3.2.2}"

echo "[INFO] Preparing Ruby ${RUBY_VERSION} for backend build..."

# 1) Activate rbenv (if installed) and switch Ruby
if [ -x "$HOME/.rbenv/bin/rbenv" ]; then
  export RBENV_ROOT="$HOME/.rbenv"
  export PATH="$RBENV_ROOT/bin:$PATH"
  eval "$(rbenv init - bash)"

  if ! rbenv versions --bare | grep -qx "${RUBY_VERSION}"; then
    echo "[INFO] Ruby ${RUBY_VERSION} not found; installing with ruby-build..."
    rbenv install "${RUBY_VERSION}"
  fi

  rbenv shell "${RUBY_VERSION}"
  rbenv rehash
else
  echo "[WARN] rbenv not found; continuing with $(ruby -v)."
fi

echo "[INFO] Ruby version: $(ruby -v)"
echo "[INFO] Gem version:  $(gem -v)"
echo "[INFO] Rails environment: ${RAILS_ENV:-production}"

# 2) System deps (pg headers) — safe to re-run
if ! dpkg -s libpq-dev >/dev/null 2>&1; then
  echo "[INFO] Installing libpq-dev..."
  sudo apt-get update -y
  sudo apt-get install -y libpq-dev
fi

# 3) Use the Bundler version pinned in Gemfile.lock (if present)
if [ -f Gemfile.lock ]; then
  BUNDLER_VERSION="$(awk '/BUNDLED WITH/{getline; gsub(/^[ \t]+/,""); print; exit}' Gemfile.lock)"
else
  BUNDLER_VERSION=""
fi

if [ -n "${BUNDLER_VERSION}" ]; then
  echo "[INFO] Using Bundler version from Gemfile.lock: ${BUNDLER_VERSION}"
  if ! gem list bundler -i -v "${BUNDLER_VERSION}" >/dev/null 2>&1; then
    echo "[INFO] Installing bundler ${BUNDLER_VERSION}..."
    gem install --user-install "bundler:${BUNDLER_VERSION}"
  fi
  export PATH="$HOME/.gem/ruby/$(ruby -e 'print RUBY_VERSION.sub(/\.\d+$/,".0")')/bin:$PATH"
  BUNDLE_CMD="bundle _${BUNDLER_VERSION}_"
else
  echo "[INFO] Gemfile.lock has no 'BUNDLED WITH'; installing Bundler ~> 2.4"
  gem install --user-install 'bundler:~> 2.4'
  export PATH="$HOME/.gem/ruby/$(ruby -e 'print RUBY_VERSION.sub(/\.\d+$/,".0")')/bin:$PATH"
  BUNDLE_CMD="bundle"
fi

echo "[INFO] Bundler version: $($BUNDLE_CMD -v)"

# 4) Bundle config + install (production only)
$BUNDLE_CMD config set --local path vendor/bundle
$BUNDLE_CMD config set --local without 'development test'
echo "[INFO] Installing gems..."
$BUNDLE_CMD install --jobs=4 --retry=3

# 5) SECRET_KEY_BASE (if missing) for asset tasks that boot Rails
if [ -z "${SECRET_KEY_BASE:-}" ]; then
  export SECRET_KEY_BASE="$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')"
fi

# 6) Precompile assets (if you have server-side assets)
echo "[INFO] Precompiling assets..."
RAILS_ENV=production $BUNDLE_CMD exec rake assets:precompile

echo "[INFO] ✅ Rails backend build completed."
