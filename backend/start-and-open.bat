@echo off
echo Starting CRM Backend Server and Opening Browser...
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
echo Starting server...
echo.

REM Start server in background and open browser after 3 seconds
start /B cmd /c "npm start"
timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5000/health

echo.
echo Server is running on http://localhost:5000
echo Health check: http://localhost:5000/health
echo.
echo Press any key to stop the server...
pause >nul

REM Kill node processes
taskkill /F /IM node.exe >nul 2>&1
