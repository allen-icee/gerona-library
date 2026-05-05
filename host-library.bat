@echo off
title Gerona Library - SERVER MODE (Desktop 10)
echo ===================================================
echo    LAUNCHING LOCAL AREA NETWORK SERVER
echo ===================================================
echo.
echo [+] Starting Laravel Server on all network interfaces...
start /B php artisan serve --host=0.0.0.0 --port=8000

echo [+] Starting Queue Worker (for background jobs)...
start /B php artisan queue:work

echo.
echo [SERVER IS LIVE]
echo Other PCs can now connect via http://192.168.1.10:8000
echo (or whatever your static IP is).
echo.
echo Close this window to shut down the server.
pause >nul
