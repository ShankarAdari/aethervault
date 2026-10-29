@echo off
title AetherVault - Cryptographic Document Sanctuary Launcher
echo ========================================================
echo       Starting AetherVault Document Management PWA
echo ========================================================
echo.
cd /d "%~dp0"

if not exist "node_modules\" (
    echo [Setup] First time launch detected. Installing dependencies...
    call npm install
    echo.
)

echo [Launch] Launching your local-first encrypted workspace...
echo [Browser] Opening http://localhost:3000 in your browser...
echo.

start "" "http://localhost:3000"
call npm run dev
pause
