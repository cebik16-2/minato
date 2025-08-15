#!/usr/bin/env bash
set -euo pipefail

RUBY_VERSION="${1:-3.2.2}"

echo "[backend] Preparing Ruby ${RUBY_VERSION} for backend build…"

# 0) Clean leaking env that can break bundler
unset GEM_HOME GEM_PATH RUBYOPT BUNDLE_PATH BUNDLE_WITHOUT BUNDLE_GEMFILE || true

# 1) Activate rbenv & Ruby
if [ -x "$HOME/.rbenv/bin/rbenv" ]; then
  export RBENV_ROOT="$HOME/.rbenv"
  export PATH="$RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH"
  eval "$(rbenv init - bash)"

  if ! rbenv versions --bare | grep -qx "${RUBY_VERSION}"; then
    echo "[backend] Installing Ruby ${RUBY_VERSION}…"
    rbenv install -s "${RUBY_VERSION}"
  fi

  rbenv shell "${RUBY_VERSION}"
  rbenv rehash
else
  echo "[WARN] rbenv not found; continuing with system Ruby: $(ruby -v)"
fi

echo "[backend] Ruby:  $(ruby -v)"
echo "[backend] gem:   $(gem -v)"

# 2) System native deps (safe to re-run)
if command -v apt-get >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y build-essential libpq-dev pkg-config zlib1g-dev libssl-dev
fi

# 3) Use Bundler version pinned in Gemfile.lock (no --user-install)
BUNDLER_VERSION=""
if [ -f Gemfile.lock ]; then
  BUNDLER_VERSION="$(awk '/BUNDLED WITH/{getline; gsub(/^[ \t]+/,""); print; exit}' Gemfile.lock || true)"
fi

if [ -n "${BUNDLER_VERSION}" ]; then
  if ! gem list bundler -i -v "${BUNDLER_VERSION}" >/dev/null 2>&1; then
    echo "[backend] Installing bundler ${BUNDLER_VERSION}…"
    gem install "bundler:${BUNDLER_VERSION}" -N
    command -v rbenv >/dev/null 2>&1 && rbenv rehash || true
  fi
  BUNDLE_CMD="bundle _${BUNDLER_VERSION}_"
else
  echo "[backend] No pinned Bundler; installing ~> 2.4…"
  gem install 'bundler:~> 2.4' -N
  command -v rbenv >/dev/null 2>&1 && rbenv rehash || true
  BUNDLE_CMD="bundle"
fi

echo "[backend] Bundler: $($BUNDLE_CMD -v)"

# 4) Make lockfile Linux-friendly if created on macOS/Windows
$BUNDLE_CMD lock --add-platform x86_64-linux || true

# 5) Install gems into workspace (not user home)
export BUNDLE_PATH="${WORKSPACE:-$PWD}/.bundle/vendor"
export BUNDLE_WITHOUT="development:test"
$BUNDLE_CMD config set path "$BUNDLE_PATH"
$BUNDLE_CMD config set without "$BUNDLE_WITHOUT"
$BUNDLE_CMD config set deployment 'true'

echo "[backend] bundle install…"
$BUNDLE_CMD install --jobs=4 --retry=3

# 6) Do NOT precompile assets or run migrations in CI
#    That belongs on the target host where full env vars/credentials exist.
echo "[backend] ✅ Gems installed. Skipping assets:precompile & DB work in CI."
echo "[backend] ✅ Ruby environment ready for backend build."