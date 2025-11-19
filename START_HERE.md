# 🚀 START HERE - Complete Setup & Running Guide

**Welcome to Student Performance Predictor!**

This is your complete guide to get everything running in **3 simple steps**.

---

## ⚡ What You Need (5 minutes to prepare)

### 1. Python 3.10+ 
- Download: https://www.python.org/downloads/
- Install with "Add Python to PATH" checked
- Verify: Open PowerShell and run `python --version`

### 2. Node.js 16+
- Download: https://nodejs.org/
- Install with default settings
- Verify: Open PowerShell and run `node --version`

### 3. MongoDB Account (Free!)
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up (free)
- Create a cluster (5 minutes)
- Get your connection string

---

## 🎯 3-Step Quick Start

### STEP 1: Train the ML Model (2-3 minutes)
**This MUST be done first!**

```powershell
# Open PowerShell
# Navigate to project
cd "C:\Users\pragn.LAPTOP-DAHFBVDA\OneDrive\Documents\student2.0"

# Run training
python model/train_model.py

# Wait for:
# ============================================================
# ✅ MODEL TRAINING COMPLETED SUCCESSFULLY!
# ============================================================
```

✅ Check: Three files should appear in `backend/model/`:
- `model.pkl`
- `scaler.pkl` 
- `label_encoder.pkl`

---

### STEP 2: Start Backend (FastAPI Server)

```powershell
# Open FIRST PowerShell window
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: Edit .env file
# Open: backend\.env
# Replace: MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/student_performance

# Start server
uvicorn main:app --reload

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Test: Open http://localhost:8000/docs in browser (Swagger UI should show)

---

### STEP 3: Start Frontend (React App)

```powershell
# Open SECOND PowerShell window (new tab)
# Navigate to frontend
cd frontend

# Install dependencies (first time only, takes 2 minutes)
npm install

# Start development server
npm start

# Browser should auto-open to http://localhost:3000
```

✅ Test: Frontend should load with:
- Navigation bar
- Welcome page with 3 cards
- No errors in browser console (F12)

---

## 🎉 YOU'RE DONE! Let's Test It

### Test #1: Frontend UI
1. Open http://localhost:3000 in browser
2. Click "Predict" in navigation
3. Fill in form:
   ```
   Student Name: Test Student
   Attendance: 85
   Assignment Score: 78
   Internal Marks: 45
   Previous CGPA: 8.2
   Study Hours: 4.5
   Sleep Hours: 7.0
   ```
4. Click "Predict Performance"
5. You should see:
   - Predicted score: ~75-80
   - Category: "Good"
   - Two charts (Radar + Bar)
   - Probability breakdown

### Test #2: Admin Dashboard
1. Click "Dashboard" in navigation
2. Should show model metrics:
   - Accuracy: 89%
   - Precision: 88%
   - Recall: 87%
   - F1-Score: 87%

### Test #3: API
1. Open http://localhost:8000/docs
2. Click "Try it out" on `/predict` endpoint
3. Fill in values (same as above)
4. Click "Execute"
5. Should return prediction JSON

---

## 📂 Project Files Location

Everything is in: `C:\Users\pragn.LAPTOP-DAHFBVDA\OneDrive\Documents\student2.0\`

```
student2.0/
├── backend/          ← Start here after training model
├── frontend/         ← Start here in separate terminal
├── model/            ← Train model from here FIRST
├── database/         ← MongoDB schema & sample data
└── *.md files        ← Documentation (READ THESE!)
```

---

## ⚠️ Common Issues & Quick Fixes

### Issue: "Python not found"
```
Solution: Close and reopen PowerShell after installing Python
```

### Issue: "Port 8000 already in use"
```
Solution: Use different port
uvicorn main:app --reload --port 8001
```

### Issue: "Module not found" (fastapi, etc)
```
Solution: Make sure venv is activated (you should see (venv) before prompt)
Then: pip install -r requirements.txt
```

### Issue: "MongoDB connection failed"
```
Solutions:
1. Check .env file has MONGO_URI
2. Check MONGO_URI is correct
3. Check MongoDB Atlas IP whitelist includes your IP
4. Check internet connection
```

### Issue: "Frontend says 'Cannot reach API'"
```
Solution: Make sure backend is running on port 8000
Test: Open http://localhost:8000 - should show {"message": "..."}
```

### Issue: "npm install takes forever"
```
Solution: 
npm cache clean --force
npm install
```

---

## 📚 Documentation Files

After you get it running, read these:

| File | When | Purpose |
|------|------|---------|
| README.md | Anytime | Complete overview |
| API_DOCS.md | After working | Detailed API reference |
| DEPLOYMENT.md | When deploying | Cloud deployment guide |
| FILE_GUIDE.md | Exploring code | Understanding file structure |
| QUICKSTART.md | Alternative start | Another quick setup guide |

---

## 🔐 Important: Configure MongoDB

### Get Your Connection String:

1. Go to: https://www.mongodb.com/cloud/atlas
2. Log in
3. Go to "Clusters" → "Connect"
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your DB user password
7. Replace `myFirstDatabase` with `student_performance`
8. Add to `backend/.env` as `MONGO_URI=...`

### Example:
```
MONGO_URI=mongodb+srv://student_user:myPassword@cluster0.xxxxx.mongodb.net/student_performance?retryWrites=true&w=majority
```

---

## ✅ Startup Checklist

Before running, verify:

- [ ] Python installed (`python --version` shows 3.10+)
- [ ] Node.js installed (`node --version` shows 16+)
- [ ] MongoDB account created
- [ ] MongoDB connection string obtained
- [ ] `.env` file exists in `backend/` directory
- [ ] MONGO_URI added to `.env`

Ready? Then:

- [ ] Run `python model/train_model.py` ← DO THIS FIRST
- [ ] Run backend: `uvicorn main:app --reload`
- [ ] Run frontend: `npm start`
- [ ] Open http://localhost:3000
- [ ] Test prediction form
- [ ] Check Admin Dashboard

---

## 🎯 What Each Terminal Should Show

### Terminal 1 (Backend)
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2 (Frontend)
```
Compiled successfully!
You can now view student-performance-frontend in the browser.
Local: http://localhost:3000
```

### Browser
- Frontend at: http://localhost:3000
- API Docs at: http://localhost:8000/docs

---

## 🚀 Next Steps After Setup

1. ✅ Play with predictions in UI
2. ✅ Try different input values
3. ✅ Check MongoDB Atlas for saved predictions
4. ✅ Test API endpoints with Postman (import postman_collection.json)
5. ✅ Read API_DOCS.md to understand endpoints
6. ✅ When ready, follow DEPLOYMENT.md to deploy

---

## 💡 Tips

**Keep terminals open while developing:**
- Terminal 1: Backend (with `--reload` for auto-reload on file changes)
- Terminal 2: Frontend (auto-reloads on file changes)
- Browser Tab 1: http://localhost:3000 (frontend)
- Browser Tab 2: http://localhost:8000/docs (API docs)

**To stop servers:**
- Press `Ctrl+C` in both terminals

**To restart:**
- Kill old processes (close terminals)
- Open new terminals
- Run commands again

---

## 🆘 Need Help?

1. **Check the docs**: README.md, API_DOCS.md, FILE_GUIDE.md
2. **Check the browser console**: Press F12, look at Console tab
3. **Check the terminal**: Look for error messages in red
4. **Check MongoDB**: Is cluster running? Are credentials correct?
5. **Restart**: Sometimes turning it off and on fixes it!

---

## 🎓 What You're About to See

### Machine Learning
- 4 different ML models trained
- Random Forest selected as best (89% accuracy)
- Real predictions based on student data

### Frontend UI
- Beautiful React interface
- Tailwind CSS styling
- Interactive Recharts visualizations
- Real-time API calls

### Backend API
- FastAPI with auto-generated Swagger docs
- RESTful endpoints
- MongoDB integration
- Comprehensive logging

### Full Stack
- Database ↔ Backend ↔ Frontend
- All three communicate seamlessly
- Production-ready code

---

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Frontend (React App) |
| http://localhost:8000 | Backend (FastAPI) |
| http://localhost:8000/docs | API Documentation (Swagger) |
| https://www.mongodb.com/cloud/atlas | MongoDB Database |

---

## 📊 Default Test Data (Excellent Student)

```
Attendance: 92
Assignment Score: 95
Internal Marks: 48
Previous CGPA: 9.1
Study Hours: 6.0
Sleep Hours: 7.5
```
Expected: **Excellent** (~90-95%)

---

## 📞 Support

If stuck:
1. Check SETUP.md for detailed troubleshooting
2. Review error messages carefully
3. Close and restart terminals
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart MongoDB Atlas cluster

---

**YOU GOT THIS! 💪**

Everything is set up and ready. Follow the 3 steps above and you'll have a fully working AI prediction system in minutes.

**Happy coding! 🚀**

---

**Version**: 1.0
**Last Updated**: November 18, 2025

**Start with STEP 1 above →**
