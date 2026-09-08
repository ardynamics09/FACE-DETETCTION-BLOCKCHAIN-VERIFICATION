#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================================"
echo "  Starting Face Identification & Blockchain Protocol"
echo "======================================================================"
echo ""

# 1. Detect Python
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "[ERROR] Python 3 is not found in your PATH!"
    echo "Please install Python 3.10+ from https://www.python.org/downloads/"
    exit 1
fi

# 2. Check Node & npm
if ! command -v npm &>/dev/null; then
    echo "[ERROR] npm is not found in your PATH!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# 3. Check Backend Dependencies
echo "Checking Backend Python dependencies..."
if ! $PYTHON_CMD -c "import fastapi, uvicorn, cv2, web3, eth_account" 2>/dev/null; then
    echo "[!] Installing missing Python packages..."
    $PYTHON_CMD -m pip install -r "$DIR/Backend/requirements.txt"
fi
echo "[OK] Backend dependencies ready!"

# 4. Check Frontend Dependencies
if [ ! -d "$DIR/Frontend/node_modules" ]; then
    echo "[!] Running npm install for Frontend..."
    cd "$DIR/Frontend"
    npm install
    cd "$DIR"
fi
echo "[OK] Frontend dependencies ready!"
echo ""

# 5. Start Backend and Frontend in background
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..."
(cd "$DIR/Backend" && $PYTHON_CMD main.py) &
BACKEND_PID=$!

echo "[2/2] Starting Vite Frontend on http://localhost:5173 ..."
(cd "$DIR/Frontend" && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT

sleep 3

# Try opening default browser
if command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:5173 >/dev/null 2>&1 &
elif command -v open &>/dev/null; then
    open http://localhost:5173 >/dev/null 2>&1 &
fi

echo "======================================================================"
echo "  System running successfully! Press Ctrl+C to stop both servers."
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)"
echo "======================================================================"

wait
