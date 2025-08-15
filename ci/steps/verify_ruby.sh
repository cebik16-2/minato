#!/usr/bin/env bash
set -euo pipefail

EXPECTED_VERSION="${1:-3.2.2}"
echo "[INFO] Verifying Ruby environment for version ${EXPECTED_VERSION}…"

# Clean any leaking Ruby env from agents
unset GEM_HOME GEM_PATH RUBYOPT BUNDLE_PATH BUNDLE_GEMFILE BUNDLE_WITHOUT || true

# rbenv setup
export RBENV_ROOT="${RBENV_ROOT:-$HOME/.rbenv}"
export PATH="$RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH"

if ! command -v rbenv >/dev/null 2>&1; then
  echo "[ERROR] rbenv not found at $RBENV_ROOT. Install it on the agent."
  exit 1
fi

# Init rbenv for bash shells
eval "$(rbenv init - bash)"

# Make sure ruby-build exists (common gotcha on fresh nodes)
if [ ! -d "$RBENV_ROOT/plugins/ruby-build" ]; then
  echo "[WARN] ruby-build plugin not found; installing it (once) improves reliability."
  mkdir -p "$RBENV_ROOT/plugins"
  git clone --depth=1 https://github.com/rbenv/ruby-build.git "$RBENV_ROOT/plugins/ruby-build" >/dev/null 2>&1 || true
fi

# Install Ruby if missing
if ! rbenv versions --bare | grep -qx "${EXPECTED_VERSION}"; then
  echo "[INFO] Installing Ruby ${EXPECTED_VERSION} (this may take a while)…"
  # Pre-reqs must already be on the agent (build-essential, libssl-dev, zlib1g-dev, etc.)
  rbenv install -s "${EXPECTED_VERSION}"
fi

# Activate it for this shell
rbenv shell "${EXPECTED_VERSION}"
rbenv rehash

# Verify version (exact match)
CURRENT_VERSION="$(ruby -e 'print RUBY_VERSION')"
if [[ "$CURRENT_VERSION" != "$EXPECTED_VERSION" ]]; then
  echo "[ERROR] Ruby version mismatch. Expected ${EXPECTED_VERSION}, got $(ruby -v)."
  exit 1
fi
echo "[INFO] Ruby $(ruby -v) OK"

# Ensure Bundler is available for this Ruby
if ! command -v bundle >/dev/null 2>&1; then
  echo "[INFO] Installing Bundler for Ruby ${EXPECTED_VERSION}…"
  gem install bundler -N
  rbenv rehash
fi

echo "[INFO] Bundler: $(bundle -v)"
echo "[INFO] gem: $(command -v gem)"
echo "[INFO] bundle: $(command -v bundle)"
echo "[INFO] Current working directory: $(pwd)"