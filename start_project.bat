@echo off
title Face Identification and Blockchain Protocol - Launcher
setlocal enabledelayedexpansion

cd /d "%~dp0"

:MAIN_MENU
cls
echo ======================================================================
echo    HH GOA 2026 - Face Identification and Blockchain Protocol
echo ======================================================================
echo.

:: ========================================================================
:: STEP 1: DEEP PYTHON DETECTION
:: ========================================================================
echo [1/4] Detecting Python installation...
set "PYTHON_CMD="

where python >nul 2>nul
if %errorlevel% equ 0 (
    python -c "import sys; sys.exit(0)" >nul 2>nul
    if !errorlevel! equ 0 (
        set "PYTHON_CMD=python"
    )
)

if "%PYTHON_CMD%"=="" (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        py -3 -c "import sys; sys.exit(0)" >nul 2>nul
        if !errorlevel! equ 0 (
            set "PYTHON_CMD=py -3"
        ) else (
            py -c "import sys; sys.exit(0)" >nul 2>nul
            if !errorlevel! equ 0 (
                set "PYTHON_CMD=py"
            )
        )
    )
)

if "%PYTHON_CMD%"=="" (
    for %%P in (
        "%LOCALAPPDATA%\Programs\Python\Python313\python.exe"
        "%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
        "%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
        "%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
        "%ProgramFiles%\Python313\python.exe"
        "%ProgramFiles%\Python312\python.exe"
        "%ProgramFiles%\Python311\python.exe"
        "%ProgramFiles%\Python310\python.exe"
        "C:\Python313\python.exe"
        "C:\Python312\python.exe"
        "C:\Python311\python.exe"
        "C:\Python310\python.exe"
    ) do (
        if exist "%%~P" (
            set "PYTHON_CMD=%%~P"
            set "PATH=%%~dpP;%%~dpPScripts;!PATH!"
            goto :PYTHON_FOUND
        )
    )
)

:PYTHON_FOUND
if "%PYTHON_CMD%"=="" (
    echo.
    echo ======================================================================
    echo  [X] ERROR: Python 3 was NOT found on this system!
    echo ======================================================================
    echo  Python 3.10+ is required to run the Backend API and ML pipeline.
    echo.
    echo  SOLUTION:
    echo  1. Download Python from: https://www.python.org/downloads/
    echo  2. IMPORTANT: Check "Add python.exe to PATH" during installation!
    echo.
    echo  Options:
    echo  [1] Open Python official download page in browser
    echo  [2] Re-check / Retry detection
    echo  [3] Exit
    echo.
    set /p "PYCHOICE=Select an option 1, 2, or 3: "
    if "!PYCHOICE!"=="1" (
        start https://www.python.org/downloads/
        echo Opened browser. Install Python, then press any key to retry...
        pause >nul
        goto :MAIN_MENU
    )
    if "!PYCHOICE!"=="2" goto :MAIN_MENU
    exit /b 1
)

for /f "tokens=*" %%V in ('%PYTHON_CMD% --version 2^>^&1') do echo     Found: %%V
echo     [OK] Python ready.
echo.

:: ========================================================================
:: STEP 2: DEEP NODE.JS AND NPM DETECTION
:: ========================================================================
echo [2/4] Detecting Node.js and npm...
set "NPM_CMD="

where npm >nul 2>nul
if %errorlevel% equ 0 (
    set "NPM_CMD=npm"
)

if "%NPM_CMD%"=="" (
    for %%N in (
        "%ProgramFiles%\nodejs\npm.cmd"
        "%ProgramFiles(x86)%\nodejs\npm.cmd"
        "%LOCALAPPDATA%\Programs\nodejs\npm.cmd"
        "%APPDATA%\npm\npm.cmd"
        "C:\Program Files\nodejs\npm.cmd"
    ) do (
        if exist "%%~N" (
            set "NPM_CMD=%%~N"
            set "PATH=%%~dpN;!PATH!"
            goto :NPM_FOUND
        )
    )
)

:NPM_FOUND
if "%NPM_CMD%"=="" (
    echo.
    echo ======================================================================
    echo  [X] ERROR: Node.js / npm was NOT found on this system!
    echo ======================================================================
    echo  Node.js 18+ is required to run the React Vite Frontend.
    echo.
    echo  SOLUTION:
    echo  1. Download Node.js LTS from: https://nodejs.org/
    echo  2. Run the installer and finish setup.
    echo.
    echo  Options:
    echo  [1] Open Node.js official download page in browser
    echo  [2] Re-check / Retry detection
    echo  [3] Exit
    echo.
    set /p "NODECHOICE=Select an option 1, 2, or 3: "
    if "!NODECHOICE!"=="1" (
        start https://nodejs.org/
        echo Opened browser. Install Node.js, then press any key to retry...
        pause >nul
        goto :MAIN_MENU
    )
    if "!NODECHOICE!"=="2" goto :MAIN_MENU
    exit /b 1
)

for /f "tokens=*" %%V in ('node --version 2^>^&1') do echo     Found Node: %%V
echo     [OK] Node.js and npm ready.
echo.

:: ========================================================================
:: STEP 3: BACKEND PYTHON DEPENDENCY CHECK AND AUTO-INSTALL
:: ========================================================================
echo [3/4] Verifying Backend dependencies - FastAPI, OpenCV, Web3, Pillow...
%PYTHON_CMD% -c "import fastapi, uvicorn, cv2, web3, eth_account, PIL, requests" >nul 2>nul
if %errorlevel% neq 0 (
    echo     [!] Some Python dependencies are missing.
    echo     [!] Installing packages from Backend\requirements.txt now...
    echo.
    %PYTHON_CMD% -m pip install -r "%~dp0Backend\requirements.txt" --no-warn-script-location
    if !errorlevel! neq 0 (
        echo     [!] Retrying with user flag...
        %PYTHON_CMD% -m pip install -r "%~dp0Backend\requirements.txt" --user --no-warn-script-location
    )
    
    :: Re-check after installation
    %PYTHON_CMD% -c "import fastapi, uvicorn, cv2, web3, eth_account, PIL, requests" >nul 2>nul
    if !errorlevel! neq 0 (
        echo.
        echo ======================================================================
        echo  [X] ERROR: Could not install all Python dependencies automatically.
        echo ======================================================================
        echo  Please make sure you are connected to the Internet.
        echo.
        echo  Press any key to retry or close this window.
        pause
        goto :MAIN_MENU
    )
)
echo     [OK] All Python dependencies are installed and verified!
echo.

:: ========================================================================
:: STEP 4: FRONTEND NODE_MODULES CHECK AND AUTO-INSTALL
:: ========================================================================
echo [4/4] Verifying Frontend dependencies - React, Vite, Axios, Tailwind...
if not exist "%~dp0Frontend\node_modules\axios" (
    echo     [!] Frontend packages missing or incomplete.
    echo     [!] Running npm install in Frontend directory...
    echo.
    cd /d "%~dp0Frontend"
    call npm.cmd install 2>nul || call npm install
    if !errorlevel! neq 0 (
        echo.
        echo ======================================================================
        echo  [X] ERROR: npm install failed!
        echo ======================================================================
        echo  Please check your internet connection.
        echo.
        cd /d "%~dp0"
        echo  Press any key to retry...
        pause
        goto :MAIN_MENU
    )
    cd /d "%~dp0"
)
echo     [OK] Frontend dependencies are installed and verified!
echo.

:: ========================================================================
:: STEP 5: LAUNCH SERVERS
:: ========================================================================
echo ======================================================================
echo   ALL CHECKS PASSED! Launching Backend and Frontend Servers...
echo ======================================================================
echo.

echo [*] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "FaceVerify Backend (FastAPI)" cmd /k "cd /d "%~dp0Backend" && %PYTHON_CMD% main.py"

echo [*] Starting Vite React Frontend on http://localhost:5173 ...
start "FaceVerify Frontend (Vite)" cmd /k "cd /d "%~dp0Frontend" && (npm.cmd run dev 2>nul || npm run dev)"

echo.
echo [*] Waiting 3 seconds for servers to start before opening browser...
ping 127.0.0.1 -n 4 >nul

start http://localhost:5173

:DASHBOARD
cls
echo ======================================================================
echo    HH GOA 2026 - Face Identification and Blockchain Protocol
echo ======================================================================
echo.
echo    STATUS: RUNNING ACTIVE
echo.
echo    - Frontend UI:   http://localhost:5173
echo    - Backend API:   http://127.0.0.1:8000
echo    - API Docs:      http://127.0.0.1:8000/docs
echo.
echo ======================================================================
echo    COMMANDS:
echo    [B] Open / Re-open Frontend in Browser
echo    [D] Open Swagger API Documentation in Browser
echo    [R] Restart All Servers
echo    [Q] Quit and Close Launcher
echo ======================================================================
echo.
set "DASHCHOICE="
set /p "DASHCHOICE=Enter command B, D, R, or Q (or press Enter to refresh): "
if /i "!DASHCHOICE!"=="B" (
    start http://localhost:5173
    goto :DASHBOARD
)
if /i "!DASHCHOICE!"=="D" (
    start http://127.0.0.1:8000/docs
    goto :DASHBOARD
)
if /i "!DASHCHOICE!"=="R" (
    goto :MAIN_MENU
)
if /i "!DASHCHOICE!"=="Q" (
    echo Exiting launcher. Background server windows will remain active.
    exit /b 0
)
goto :DASHBOARD
