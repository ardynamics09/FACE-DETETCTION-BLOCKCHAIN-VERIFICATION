@echo off
title Face Identification and Blockchain Protocol - Dependency Installer
setlocal enabledelayedexpansion

cd /d "%~dp0"

:INSTALL_MENU
cls
echo ======================================================================
echo    FaceVerify Protocol - Automated Dependency Installer
echo ======================================================================
echo.

:: 1. Deep Python Detection
echo [1/2] Detecting Python environment...
set "PYTHON_CMD="

where python >nul 2>nul
if %errorlevel% equ 0 (
    python -c "import sys; sys.exit(0)" >nul 2>nul
    if !errorlevel! equ 0 set "PYTHON_CMD=python"
)

if "%PYTHON_CMD%"=="" (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        py -3 -c "import sys; sys.exit(0)" >nul 2>nul
        if !errorlevel! equ 0 set "PYTHON_CMD=py -3"
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
            goto :PY_FOUND
        )
    )
)

:PY_FOUND
if "%PYTHON_CMD%"=="" (
    echo.
    echo ======================================================================
    echo  [X] ERROR: Python 3 not found!
    echo ======================================================================
    echo  Please install Python 3.10+ from https://www.python.org/downloads/
    echo  Check Add Python to PATH during installation.
    echo.
    echo  [1] Open Python Download Page
    echo  [2] Retry
    echo  [3] Exit
    set /p "C=Select option 1, 2, or 3: "
    if "!C!"=="1" (
        start https://www.python.org/downloads/
        pause
        goto :INSTALL_MENU
    )
    if "!C!"=="2" goto :INSTALL_MENU
    exit /b 1
)

for /f "tokens=*" %%V in ('%PYTHON_CMD% --version 2^>^&1') do echo     Found: %%V
echo     Installing Python dependencies from requirements.txt...
%PYTHON_CMD% -m pip install --upgrade pip --quiet
%PYTHON_CMD% -m pip install -r "%~dp0Backend\requirements.txt" --no-warn-script-location
if !errorlevel! neq 0 (
    echo     Retrying with user flag...
    %PYTHON_CMD% -m pip install -r "%~dp0Backend\requirements.txt" --user --no-warn-script-location
)
echo     [OK] Python dependencies ready.
echo.

:: 2. Node and npm Detection
echo [2/2] Detecting Node.js and npm...
set "NPM_CMD="

where npm >nul 2>nul
if %errorlevel% equ 0 set "NPM_CMD=npm"

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
            goto :NODE_FOUND
        )
    )
)

:NODE_FOUND
if "%NPM_CMD%"=="" (
    echo.
    echo ======================================================================
    echo  [X] ERROR: Node.js / npm not found!
    echo ======================================================================
    echo  Please install Node.js LTS from https://nodejs.org/
    echo.
    echo  [1] Open Node.js Download Page
    echo  [2] Retry
    echo  [3] Exit
    set /p "C=Select option 1, 2, or 3: "
    if "!C!"=="1" (
        start https://nodejs.org/
        pause
        goto :INSTALL_MENU
    )
    if "!C!"=="2" goto :INSTALL_MENU
    exit /b 1
)

for /f "tokens=*" %%V in ('node --version 2^>^&1') do echo     Found Node: %%V
echo     Installing Frontend npm packages...
cd /d "%~dp0Frontend"
call npm.cmd install 2>nul || call npm install
cd /d "%~dp0"
echo     [OK] Frontend dependencies ready.
echo.

echo ======================================================================
echo   SUCCESS! ALL DEPENDENCIES ARE INSTALLED AND READY!
echo   You can now launch the project using start_project.bat
echo ======================================================================
echo.
echo Press any key to close this installer...
pause >nul
