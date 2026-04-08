@echo off
setlocal enabledelayedexpansion
title Gerona Library - LAN HOST MODE

:: Auto-detect your Wi-Fi IPv4 Address
for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set IP=%%a

echo ===================================================
echo    LAUNCHING GERONA LIBRARY LAN HOSTING
echo ===================================================
echo.
echo    Tell other desktops on the Wi-Fi to visit:
echo    http://!IP!:8000
echo.
echo ===================================================
echo.
echo [+] Starting Queue Worker in background...
start /B php artisan queue:work

echo [+] Starting Laravel Server on Network...
echo.
echo All processes are running! Keep this window open.
echo To stop hosting, press Ctrl+C or close this terminal.
echo.

:: We removed 'start /B' here so it runs in the foreground and keeps the window clean!
php artisan serve --host=0.0.0.0 --port=8000