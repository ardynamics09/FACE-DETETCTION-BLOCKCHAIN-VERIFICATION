@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ======================================================================
echo   Starting Face Identification & Blockchain Protocol
echo ======================================================================
echo.

:: 1. Detect Python Command
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
    echo [ERROR] Python is not installed or not in your system PATH!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo (Make sure to check "Add Python to PATH" during installation)
    echo.
    pause
    exit /b 1
)

:: 2. Check Node & npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in your system PATH!
    echo Please install Node.js (LTS version) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 3. Auto-check & Install Backend Dependencies if missing
echo Checking Backend Python packages...
%PYTHON_CMD% -c "import fastapi, uvicorn, cv2, web3, eth_account" >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Missing Python packages detected. Installing requirements now...
    %PYTHON_CMD% -m pip install -r "%~dp0Backend\requirements.txt"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Python dependencies.
        pause
        exit /b 1
    )
)
echo [OK] Backend Python packages ready!

:: 4. Auto-check & Install Frontend node_modules if missing
if not exist "%~dp0Frontend\node_modules" (
    echo [!] Frontend dependencies not found. Running npm install...
    cd /d "%~dp0Frontend"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)
echo [OK] Frontend packages ready!
echo.

:: 5. Launch Backend Server
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "FaceVerify Backend (FastAPI)" cmd /k "cd /d "%~dp0Backend" && %PYTHON_CMD% main.py"

:: 6. Launch Frontend Server
echo [2/2] Launching Vite React Frontend on http://localhost:5173 ...
start "FaceVerify Frontend (Vite)" cmd /k "cd /d "%~dp0Frontend" && npm run dev"

:: 7. Wait and Open Browser
echo.
echo Waiting for servers to initialize...
timeout /t 3 >nul
start http://localhost:5173

echo ======================================================================
echo   System running successfully!
echo   Frontend: http://localhost:5173
echo   Backend API: http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)
echo ======================================================================
echo.
