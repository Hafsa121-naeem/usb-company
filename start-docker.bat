@echo off
title NexDrive MySQL & Docker Launcher
color 0a
echo ======================================================================
echo           STARTING NEXDRIVE MYSQL & DOCKER CONTAINERS
echo ======================================================================
echo.
cd /d "%~dp0"
echo [*] Running: docker compose up -d ...
echo.
docker compose up -d
if %errorlevel% neq 0 (
    echo.
    echo [X] Error starting containers. Please make sure Docker Desktop is running.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Containers started successfully!
echo ----------------------------------------------------------------------
echo  - phpMyAdmin (MySQL DB): http://localhost:8080
echo  - Admin Dashboard:       http://localhost:3000/admin/index.html
echo  - Public Website:        http://localhost:3000
echo ----------------------------------------------------------------------
echo.
echo [*] Opening phpMyAdmin and Admin Dashboard in browser...
timeout /t 3 >nul
start http://localhost:8080
start http://localhost:3000/admin/index.html
echo.
echo [*] Done! All services are running in Docker.
pause
