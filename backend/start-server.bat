@echo off
echo Starting CRM Backend Server...
echo.

cd /d "%~dp0"

REM Set npm to online mode
set npm_config_offline=false

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

echo.
echo Starting server on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
call npm start
