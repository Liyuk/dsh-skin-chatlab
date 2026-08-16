#!/bin/bash
# Detached restart of `dsh web` so the updated dsh-skin-chatlab client bundle is served.
# Clean single restart: kill once, wait for the port to free, then start once.
set -x
exec >> "$HOME/.dsh/dsh-web-restart.log" 2>&1
sleep 2
pkill -f "\.bin/dsh web" 2>/dev/null || true
pkill -f "npm exec @deepseek-ai/dsh web" 2>/dev/null || true
# Wait for the port to actually free (up to ~15s).
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if ! lsof -iTCP:3080 -sTCP:LISTEN >/dev/null 2>&1; then break; fi
  sleep 1
done
export PATH="$HOME/.npm/_npx/1e7f6d9597241db0/node_modules/.bin:$PATH"
cd "$HOME/.dsh"
exec dsh web
