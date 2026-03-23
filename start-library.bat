@echo off
title Gerona Library System Launcher
echo ===================================================
echo    STARTING GERONA MUNICIPAL LIBRARY SYSTEM...
echo ===================================================
echo.

echo 1. Starting Laravel Server (Hidden)...
:: Runs in background, saves output/errors to a log file
start /B php artisan serve --port=8000 > storage\logs\local_server.log 2>&1

echo 2. Starting Background Queue Worker (Hidden)...
:: Runs in background, saves output/errors to a log file
start /B php artisan queue:work > storage\logs\local_queue.log 2>&1

echo 3. Starting Ngrok Secure Tunnel...
echo.
echo [!] Servers are running in the background. 
echo [!] If you get a 502 error, check storage\logs\local_server.log
echo.
echo To fully shut down later, close this window and run "taskkill /IM php.exe /F" in your terminal.
echo.
ngrok.exe http 8000