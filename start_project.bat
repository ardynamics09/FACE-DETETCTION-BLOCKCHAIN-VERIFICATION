@echo off
echo ===================================================
echo   Starting Face Identification & Blockchain Protocol
echo ===================================================

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "FaceVerify Backend" cmd /k "cd Backend && python main.py"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "FaceVerify Frontend" cmd /k "cd Frontend && npm.cmd run dev"

timeout /t 3 >nul
start http://localhost:5173

echo.
echo ===================================================
echo   System running! Browser opened at http://localhost:5173
echo ===================================================
