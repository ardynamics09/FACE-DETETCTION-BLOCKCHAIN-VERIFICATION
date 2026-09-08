@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ======================================================================
echo    FaceVerify Protocol - Installing All Project Dependencies
echo ======================================================================
echo.

:: 1. Check Python
echo [1/2] Checking Python environment...
set PYTHON_CMD=
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
    )
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python is not found in your system PATH!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo IMPORTANT: Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Found Python: 
%PYTHON_CMD% --version
echo Installing Backend Python requirements...
%PYTHON_CMD% -m pip install --upgrade pip --quiet
%PYTHON_CMD% -m pip install -r "%~dp0Backend\requirements.txt"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies. Please check your internet connection or Python version.
    pause
    exit /b 1
)
echo [OK] Python dependencies installed successfully!
echo.

:: 2. Check Node.js and npm
echo [2/2] Checking Node.js and npm environment...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not found in your system PATH!
    echo Please install Node.js (LTS version) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Found Node.js:
node --version
echo Found npm:
npm --version
echo.
echo Installing Frontend packages (npm install)...
cd /d "%~dp0Frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed! Please check your internet connection or Node.js installation.
    pause
    exit /b 1
)
cd /d "%~dp0"
echo [OK] Frontend dependencies installed successfully!
echo.

echo ======================================================================
echo    ALL DEPENDENCIES INSTALLED SUCCESSFULLY!
echo    You can now run "start_project.bat" to start the whole system!
echo ======================================================================
echo.
pause
