@echo off
setlocal

:: Check if npm command exists
where npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Error, npm is not installed. Please install Node.js and npm.
    exit /b 1
)

:: Change to the cmd directory and run npm install
cd ./cmd
if ERRORLEVEL 1 (
    echo Failed to change directory to ./cmd
    exit /b 1
)

echo Installing packages...

npm install

if %ERRORLEVEL% NEQ 0 (
    echo Error, npm install failed.
    exit /b 1
)

pause