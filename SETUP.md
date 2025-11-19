# Setup and Installation Guide

Complete step-by-step guide to set up and run the Student Performance Predictor system.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [ML Model Training](#ml-model-training)
4. [Frontend Setup](#frontend-setup)
5. [MongoDB Configuration](#mongodb-configuration)
6. [Running the Application](#running-the-application)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Windows 10/11, macOS, or Linux
- 4GB RAM minimum
- 500MB free disk space

### Software Required
- **Python 3.10 or higher**
  - Download: https://www.python.org/downloads/
  - Ensure "Add Python to PATH" is checked during installation

- **Node.js 16 or higher**
  - Download: https://nodejs.org/
  - Includes npm (Node Package Manager)

- **Git** (optional but recommended)
  - Download: https://git-scm.com/

- **MongoDB Atlas Account** (free)
  - Sign up: https://www.mongodb.com/cloud/atlas
  - Or use local MongoDB installation

## Backend Setup

### Step 1: Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install required packages
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

```bash
# Edit the .env file in backend directory
# Windows (Notepad)
notepad .env
# macOS/Linux (nano)
nano .env
```

Update the `.env` file with your MongoDB URI:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/student_performance?retryWrites=true&w=majority
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
LOG_LEVEL=INFO
```

### Step 3: Verify Backend Setup

```bash
# Test Python installation
python --version

# Test FastAPI installation
pip show fastapi
```

## ML Model Training

### Step 4: Train the Machine Learning Model

**IMPORTANT**: This must be done before running the backend server!

```bash
# Navigate to model directory
cd model

# Run training script (this takes 2-3 minutes)
python train_model.py

# Expected output:
# ============================================================
# STUDENT PERFORMANCE PREDICTION - ML TRAINING
# ============================================================
# ...
# ✅ MODEL TRAINING COMPLETED SUCCESSFULLY!
# ============================================================
```

### Step 5: Verify Model Files

Check that these files were created in `backend/model/`:
- `model.pkl` (5-10 MB)
- `scaler.pkl` (1 KB)
- `label_encoder.pkl` (1 KB)

```bash
# On Windows
dir backend\model\

# On macOS/Linux
ls -la backend/model/
```

## Frontend Setup

### Step 6: Install Node Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install packages (this takes 2-3 minutes)
npm install

# Verify installation
npm --version
```

### Step 7: Configure Frontend Environment (Optional)

```bash
# Create .env file in frontend directory
# Edit .env to point to your backend API
REACT_APP_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`

## MongoDB Configuration

### Step 8: Set Up MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email or GitHub
   - Verify email

2. **Create Cluster**
   - Click "Create a Cluster"
   - Choose "Free Tier" (M0)
   - Select your preferred region (AWS recommended)
   - Click "Create Cluster" (takes 5-10 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `student_user`
   - Password: Create a strong password (save it!)
   - Built-in Role: `Atlas Admin`
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or specify your IP)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `student_performance`

6. **Update .env**
   ```
   MONGO_URI=mongodb+srv://student_user:<password>@cluster0.xxxxx.mongodb.net/student_performance?retryWrites=true&w=majority
   ```

### Alternative: Local MongoDB

If you prefer local MongoDB:

```bash
# Install MongoDB Community Edition
# Visit: https://docs.mongodb.com/manual/installation/

# Update .env
MONGO_URI=mongodb://localhost:27017/student_performance
```

## Running the Application

### Step 9: Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Expected output:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

**Backend is now running at**: `http://localhost:8000`
**API Docs**: `http://localhost:8000/docs`

### Step 10: Start Frontend Server (New Terminal/Tab)

```bash
# Navigate to frontend directory
cd frontend

# Start React development server
npm start

# Expected output:
# Compiled successfully!
# You can now view student-performance-frontend in the browser.
# Local: http://localhost:3000
```

**Frontend is now running at**: `http://localhost:3000`

## Verification

### Step 11: Test the System

1. **Open Frontend**: http://localhost:3000
   - Should see home page with navigation bar
   - No errors in browser console (F12)

2. **Test Prediction**
   - Click "Predict" in navigation
   - Fill in sample data:
     ```
     Attendance: 85
     Assignment Score: 78
     Internal Marks: 45
     Previous CGPA: 8.2
     Study Hours: 4.5
     Sleep Hours: 7.0
     ```
   - Click "Predict Performance"
   - Should see results with score and category

3. **Check API Documentation**
   - Go to http://localhost:8000/docs
   - You should see Swagger UI with all endpoints

4. **Test Admin Dashboard**
   - Click "Dashboard" in navigation
   - Should display model metrics and information

5. **Check MongoDB**
   - If MongoDB is set up, predictions should be stored
   - Check MongoDB Atlas "Browse Collections" to verify data

## Troubleshooting

### Issue: "Module not found" or "ModuleNotFoundError"

**Solution**:
```bash
# Ensure virtual environment is activated
# Then reinstall packages
pip install -r requirements.txt

# Or install specific package
pip install fastapi
```

### Issue: "Port 8000/3000 already in use"

**Solution** (Windows):
```bash
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
uvicorn main:app --port 8001
```

**Solution** (macOS/Linux):
```bash
# Find process
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Issue: MongoDB connection error

**Solutions**:
- Verify `MONGO_URI` is correct in `.env`
- Check MongoDB Atlas IP whitelist settings
- Ensure cluster is running in MongoDB Atlas
- Verify network connectivity (try ping)
- Check username and password in connection string

### Issue: CORS error or "Cannot reach API"

**Solutions**:
- Verify backend is running (check http://localhost:8000)
- Verify frontend API URL is correct in `.env`
- Check browser console for error messages (F12)
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Model files not found

**Solution**:
```bash
# Must train model first
cd model
python train_model.py

# Verify files created
ls -la ../backend/model/
```

### Issue: Python version error

**Solution**:
```bash
# Check Python version
python --version

# Should be 3.10 or higher
# If not, download from https://www.python.org/downloads/

# You can also use python3
python3 --version
python3 -m venv venv
```

### Issue: npm install takes too long or fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# Or use yarn
npm install -g yarn
yarn install
```

## Development Tips

### Running in Development Mode

Backend will auto-reload on file changes:
```bash
uvicorn main:app --reload
```

Frontend will auto-reload automatically with Create React App.

### Accessing Logs

```bash
# Backend logs (if running with redirect)
tail -f backend/logs/predictions_*.log
```

### Testing API Endpoints

Use Swagger UI at `http://localhost:8000/docs` or Postman collection.

### Database Inspection

In MongoDB Atlas:
1. Click on "Browse Collections"
2. Select database: `student_performance`
3. View collections: `predictions`, `students`, `users`

## Next Steps

1. **Read API_DOCS.md** for detailed API documentation
2. **Check postman_collection.json** for pre-built API requests
3. **Explore components** in `frontend/src/components/`
4. **Customize** styling in `frontend/src/index.css`
5. **Deploy** using deployment instructions in README.md

## Getting Help

If you encounter issues:
1. Check the Troubleshooting section
2. Review error messages carefully
3. Check browser console (F12) for frontend errors
4. Check backend terminal for server errors
5. Verify all prerequisites are installed
6. Try searching GitHub issues or StackOverflow

---

**Setup Guide Version**: 1.0
**Last Updated**: November 18, 2025
