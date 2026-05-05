@echo off
setlocal enabledelayedexpansion
title Gerona Library - SERVER MODE (Desktop 10)

for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set IP=%%a

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
echo Other PCs can now connect via:
echo http://!IP!:8000
echo.
echo Close this window to shut down the server.
pause >nul
