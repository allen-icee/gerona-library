@echo off
title Gerona Library - DEVELOPER MODE
echo ===================================================
echo    LAUNCHING DEVELOPER ENVIRONMENT (Hot Reload)
echo ===================================================
echo.
echo Shoutout to My Dearest Beloved Miss
echo [+] Starting Laravel Server...
start /B php artisan serve --host=0.0.0.0 --port=8000

echo [+] Starting Queue Worker...
start /B php artisan queue:work

echo [+] Starting Vite Frontend (Hot Reloading)...
start /B npm run dev -- --host 127.0.0.1

echo.
echo [DEV ENVIRONMENT IS LIVE]
echo Local Access: http://localhost:8000
echo.
echo Close this window to shut down all processes.
pause >nul
