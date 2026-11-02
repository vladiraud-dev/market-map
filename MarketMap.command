#!/bin/bash
# Двойной клик по этому файлу запускает MarketMap на Mac.
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1

if command -v node >/dev/null 2>&1; then
  ( sleep 1; open "http://localhost:8080" ) &
  node server.js
else
  echo ""
  echo "  Node.js не найден, открываю сайт как файл."
  echo "  Чтобы работали уведомления и Bybit, установи Node.js с https://nodejs.org и запусти этот файл снова."
  echo ""
  open "index.html"
fi
