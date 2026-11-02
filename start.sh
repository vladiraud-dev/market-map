#!/bin/sh
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js не найден. Установи его с https://nodejs.org (LTS) и запусти снова."
  exit 1
fi
( sleep 1; (open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null) ) &
node server.js
