@echo off
REM Verification script for Student Performance Predictor (Windows)
REM Run this to verify all components are set up correctly

echo ==================================
echo Student Performance Predictor
echo Setup Verification Script
echo ==================================
echo.

REM Check Python
echo [1/6] Checking Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    python --version
    echo ✓ Python found
) else (
    echo ✗ Python not found. Please install Python 3.10+
    exit /b 1
)
echo.

REM Check Node
echo [2/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo ✓ Node.js found
) else (
    echo ✗ Node.js not found. Please install Node.js 16+
    exit /b 1
)
echo.

REM Check npm
echo [3/6] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    npm --version
    echo ✓ npm found
) else (
    echo ✗ npm not found. Please install npm
    exit /b 1
)
echo.

REM Check backend requirements
echo [4/6] Checking backend requirements.txt...
if exist "backend\requirements.txt" (
    echo ✓ requirements.txt found
) else (
    echo ✗ requirements.txt not found
    exit /b 1
)
echo.

REM Check frontend package.json
echo [5/6] Checking frontend package.json...
if exist "frontend\package.json" (
    echo ✓ package.json found
) else (
    echo ✗ package.json not found
    exit /b 1
)
echo.

REM Check .env file
echo [6/6] Checking .env configuration...
if exist "backend\.env" (
    echo ✓ .env file found
    findstr /M "MONGO_URI" "backend\.env" >nul
    if %errorlevel% equ 0 (
        echo ✓ MONGO_URI configured
    ) else (
        echo ✗ MONGO_URI not configured in .env
        echo   Please add: MONGO_URI=mongodb+srv://...
    )
) else (
    echo ✗ .env file not found
    exit /b 1
)
echo.

echo ==================================
echo ✅ All basic checks passed!
echo ==================================
echo.
echo Next steps:
echo 1. Train ML model: cd model ^&^& python train_model.py
echo 2. Start backend: cd backend ^&^& uvicorn main:app --reload
echo 3. Start frontend: cd frontend ^&^& npm start
echo.
pause
