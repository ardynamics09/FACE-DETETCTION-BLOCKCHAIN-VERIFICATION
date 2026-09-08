#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================================"
echo "   FaceVerify Protocol - Installing All Project Dependencies"
echo "======================================================================"
echo ""

# 1. Check Python
echo "[1/2] Checking Python environment..."
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "[ERROR] Python 3 is not found in your PATH!"
    echo "Please install Python 3.10+ from https://www.python.org/downloads/"
    exit 1
fi

echo "Found Python: $($PYTHON_CMD --version)"
$PYTHON_CMD -m pip install --upgrade pip --quiet
$PYTHON_CMD -m pip install -r "$DIR/Backend/requirements.txt"
echo "[OK] Python dependencies installed successfully!"
echo ""

# 2. Check Node & npm
echo "[2/2] Checking Node.js and npm environment..."
if ! command -v npm &>/dev/null; then
    echo "[ERROR] npm is not found in your PATH!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Found Node.js: $(node --version)"
echo "Found npm: $(npm --version)"
cd "$DIR/Frontend"
npm install
cd "$DIR"
echo "[OK] Frontend dependencies installed successfully!"
echo ""
echo "======================================================================"
echo "   ALL DEPENDENCIES INSTALLED SUCCESSFULLY!"
echo "   Run ./start_project.sh to launch the application."
echo "======================================================================"
