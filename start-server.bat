@echo off
title NexDrive USB Products Management Server
color 0b
echo ======================================================================
echo           NEXDRIVE USB PRODUCTS MANAGEMENT SYSTEM
echo ======================================================================
echo.
echo [*] Checking Node.js runtime...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Error: Node.js is not found in PATH!
    echo     Please make sure Node.js is installed.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is ready!
echo [*] Starting NexDrive Web & Admin Server on http://localhost:3000 ...
echo.
echo ----------------------------------------------------------------------
echo  - Public Catalog:  http://localhost:3000/products.html
echo  - Admin Dashboard: http://localhost:3000/admin
echo ----------------------------------------------------------------------
echo.
echo [*] Opening Admin Dashboard in your browser...
start http://localhost:3000/admin

echo [*] Server is now running. Press Ctrl+C in this window to stop.
echo.
node server.js
pause
