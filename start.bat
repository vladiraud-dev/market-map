@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js не найден.
  echo  Скачай и установи его с https://nodejs.org ^(кнопка LTS^), потом снова запусти start.bat
  echo.
  start "" https://nodejs.org
  pause
  exit /b
)
start "" http://localhost:8080
node server.js
pause
