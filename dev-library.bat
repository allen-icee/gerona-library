@echo off
title Gerona Library - DEVELOPER MODE
echo ===================================================
echo    LAUNCHING 1-WINDOW DEVELOPER ENVIRONMENT...
echo ===================================================
echo.
echo [+] Starting Laravel Server...
start /B php artisan serve --host=0.0.0.0 --port=8000

echo [+] Starting Queue Worker...
start /B php artisan queue:work

echo [+] Starting Vite Frontend (Hot Reloading)...
start /B npm run dev

echo [+] Starting Ngrok Secure Tunnel...
echo.
echo All processes are running in this single window!
echo Close this window to shut everything down.
echo.
ngrok.exe http 8000