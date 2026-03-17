@echo off
title Gerona Library System
echo ===================================================
echo    STARTING GERONA MUNICIPAL LIBRARY SYSTEM...
echo ===================================================
echo.
echo 1. Starting Laravel Server (Background)...
start /B php artisan serve --host=0.0.0.0 --port=8000 > NUL 2>&1

echo 2. Starting Background Queue Worker (Background)...
start /B php artisan queue:work > NUL 2>&1

echo 3. Starting Ngrok Secure Tunnel...
echo.
echo [!] To safely shut down the system later, simply close this window.
echo.
:: This will take over the main window so you can see your link!
ngrok.exe http 8000