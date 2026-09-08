@echo off
title Face Identification and Blockchain Protocol - Environment Diagnostics
setlocal enabledelayedexpansion

cd /d "%~dp0"
cls

echo ======================================================================
echo    SYSTEM AND ENVIRONMENT DIAGNOSTICS
echo ======================================================================
echo.

echo [1] Operating System:
ver
echo.

echo [2] Python Diagnostics:
where python 2>nul
if %errorlevel% equ 0 (
    echo   python found in PATH.
    python --version
) else (
    echo   [!] python NOT found in PATH.
)

where py 2>nul
if %errorlevel% equ 0 (
    echo   py launcher found in PATH.
    py --version
) else (
    echo   [!] py launcher NOT found in PATH.
)
echo.

echo [3] Node.js and npm Diagnostics:
where node 2>nul
if %errorlevel% equ 0 (
    echo   node found in PATH.
    node --version
) else (
    echo   [!] node NOT found in PATH.
)

where npm 2>nul
if %errorlevel% equ 0 (
    echo   npm found in PATH.
    npm --version
) else (
    echo   [!] npm NOT found in PATH.
)
echo.

echo [4] Folder Structure Check:
if exist "%~dp0Backend\main.py" (
    echo   [OK] Backend\main.py exists.
) else (
    echo   [X] Backend\main.py missing!
)

if exist "%~dp0Frontend\package.json" (
    echo   [OK] Frontend\package.json exists.
) else (
    echo   [X] Frontend\package.json missing!
)

if exist "%~dp0Frontend\node_modules\axios" (
    echo   [OK] Frontend\node_modules\axios is installed.
) else (
    echo   [!] Frontend\node_modules\axios is missing. Run install_dependencies.bat.
)
echo.

echo ======================================================================
echo    END OF DIAGNOSTICS
echo ======================================================================
echo.
echo Press any key to close...
pause >nul
