#!/bin/bash

# Verification script for Student Performance Predictor
# Run this to verify all components are set up correctly

echo "=================================="
echo "Student Performance Predictor"
echo "Setup Verification Script"
echo "=================================="
echo ""

# Check Python
echo "[1/6] Checking Python..."
if command -v python3 &> /dev/null; then
    python3 --version
    echo "✓ Python found"
else
    echo "✗ Python not found. Please install Python 3.10+"
    exit 1
fi
echo ""

# Check Node
echo "[2/6] Checking Node.js..."
if command -v node &> /dev/null; then
    node --version
    echo "✓ Node.js found"
else
    echo "✗ Node.js not found. Please install Node.js 16+"
    exit 1
fi
echo ""

# Check npm
echo "[3/6] Checking npm..."
if command -v npm &> /dev/null; then
    npm --version
    echo "✓ npm found"
else
    echo "✗ npm not found. Please install npm"
    exit 1
fi
echo ""

# Check backend requirements
echo "[4/6] Checking backend requirements..."
if [ -f "backend/requirements.txt" ]; then
    echo "✓ requirements.txt found"
else
    echo "✗ requirements.txt not found"
    exit 1
fi
echo ""

# Check frontend package.json
echo "[5/6] Checking frontend package.json..."
if [ -f "frontend/package.json" ]; then
    echo "✓ package.json found"
else
    echo "✗ package.json not found"
    exit 1
fi
echo ""

# Check .env file
echo "[6/6] Checking .env configuration..."
if [ -f "backend/.env" ]; then
    echo "✓ .env file found"
    if grep -q "MONGO_URI" "backend/.env"; then
        echo "✓ MONGO_URI configured"
    else
        echo "✗ MONGO_URI not configured in .env"
        echo "  Please add: MONGO_URI=mongodb+srv://..."
    fi
else
    echo "✗ .env file not found"
    exit 1
fi
echo ""

echo "=================================="
echo "✅ All basic checks passed!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Train ML model: cd model && python train_model.py"
echo "2. Start backend: cd backend && uvicorn main:app --reload"
echo "3. Start frontend: cd frontend && npm start"
echo ""
