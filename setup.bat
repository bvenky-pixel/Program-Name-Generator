@echo off
REM Naming Intelligence Engine - Setup Wizard for Windows
REM Just double-click this file to run setup

echo.
echo ====================================
echo Naming Intelligence Engine Setup
echo ====================================
echo.

node setup.js

if errorlevel 1 (
    echo.
    echo Setup failed. Make sure Node.js is installed from nodejs.org
    pause
    exit /b 1
)
