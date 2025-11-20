# Deployment & Setup Instructions

## Pre-Deployment Checklist

- [ ] All code changes applied
- [ ] No compilation errors in terminal
- [ ] Tested dark mode toggle
- [ ] Tested new marks input (obtained vs total)
- [ ] Tested backend API with cURL/Postman
- [ ] MongoDB connection verified
- [ ] Backend logs show no errors
- [ ] All documentation files created

---

## Step-by-Step Deployment

### Step 1: Backend Setup

#### Restart Backend Server
```bash
# Terminal 1 - Kill old process
taskkill /F /PID <pid>  # Find PID from: netstat -ano | findstr :8000

# Navigate to backend
cd backend

# Ensure virtual environment is active
venv\Scripts\activate

# Start server with reload enabled
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

#### Verify Backend is Running
```bash
# Test in new terminal
curl http://localhost:8000/

# Expected response:
# {"message":"Student Performance Predictor API is running!"}
```

---

### Step 2: Frontend Setup

#### Install Dependencies (if needed)
```bash
# Terminal 2 - Navigate to frontend
cd frontend

# Install dependencies
npm install

# Verify no errors - should see "added X packages"
```

#### Start Frontend Development Server
```bash
# In frontend directory
npm start

# Expected output:
# Compiled successfully!
# Webpack compiled with warnings/no warnings
# You can now view student2.0 in the browser
```

**Frontend will open at:** http://localhost:3000

---

### Step 3: Test New Features

#### Test 1: Dark Mode
1. Open http://localhost:3000 in browser
2. Look for 🌙 button in top-right navbar
3. Click it - entire UI should turn dark
4. Click again - returns to light mode
5. Refresh page - your preference should persist

**✓ Pass:** Dark mode toggle works and preference saves

---

#### Test 2: New Marks Input
1. Click "Predict" in navbar
2. Fill student info:
   - Student Name: "Test Student"
   - Roll Number: "001"
3. In **Assignments** section:
   - Subject: "Mathematics"
   - Marks Obtained: "45"
   - Total Marks: "50"
   - **Should show:** "Percentage: 90.00%"
4. In **Subjects** section:
   - Subject: "Physics"  
   - Marks Obtained: "75"
   - Total Marks: "100"
   - **Should show:** "Percentage: 75.00%"

**✓ Pass:** Percentage calculates correctly

---

#### Test 3: Validation
1. In Assignments: Enter Obtained = 60, Total = 50
2. Try to submit form
3. **Should show error:** "Marks obtained cannot exceed total marks"

**✓ Pass:** Validation prevents invalid data

---

#### Test 4: API Request
```bash
# In new terminal, use curl
curl -X POST http://localhost:8000/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"student_name\":\"John\",\"roll_number\":\"123\",\"attendance\":85,\"prev_cgpa\":8,\"study_hours\":5,\"sleep_hours\":7,\"assignments\":[{\"subject_name\":\"Math\",\"marks_obtained\":45,\"marks_total\":50}],\"subjects\":[{\"subject_name\":\"Physics\",\"marks_obtained\":78,\"marks_total\":100}]}"
```

**Expected Response:**
```json
{
  "predicted_score": 72.5,
  "predicted_category": "Good",
  "probabilities": {...},
  "message": "Prediction successful...",
  "subject_performance": [...],
  "study_recommendations": [...]
}
```

**✓ Pass:** Backend correctly processes new schema

---

#### Test 5: Dark Mode in Form
1. Go to /predict page
2. Toggle dark mode with 🌙 button
3. **Check:**
   - Form background is dark gray
   - All input fields are readable
   - Percentage text is visible
   - Assignment section (blue variant) is dark
   - Subject section (green variant) is dark
   - All buttons are visible

**✓ Pass:** Form renders correctly in dark mode

---

### Step 4: Database Verification

#### Check MongoDB Records
```bash
# Using MongoDB Compass or mongo shell
# Connect to: mongodb+srv://username:password@cluster...

# Query latest prediction
db.student_predictor.predictions.findOne({}, {sort: {created_at: -1}})

# Should show:
# {
#   "_id": ObjectId(...),
#   "student_name": "John",
#   "assignment_percentage": 90,
#   "subject_percentage": 75,
#   "assignments": [
#     {
#       "subject_name": "Math",
#       "marks_obtained": 45,
#       "marks_total": 50,
#       "percentage": 90
#     }
#   ],
#   ...
# }
```

**✓ Pass:** Database stores percentage values correctly

---

## Production Deployment

### Frontend (Vercel/Netlify)

#### Build for Production
```bash
cd frontend
npm run build
# Creates 'build' folder ready for deployment
```

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable:
# REACT_APP_API_URL = https://your-backend-api.com
```

#### Deploy to Netlify
```bash
# Build first
npm run build

# Deploy using CLI
netlify deploy --prod --dir=build
```

---

### Backend (Render/Railway)

#### Prepare for Deployment
1. Ensure all changes are committed to git
2. Update `requirements.txt` if needed:
   ```bash
   pip freeze > requirements.txt
   ```

3. Create/Update `.env` file with production variables:
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   API_HOST=0.0.0.0
   API_PORT=8000
   ```

#### Deploy to Render
1. Connect GitHub repository to Render
2. Create new Web Service
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
5. Add environment variables from `.env`
6. Deploy

#### Deploy to Railway
1. Connect GitHub repository to Railway
2. Create new project
3. Add MongoDB plugin
4. Set environment variables
5. Deploy automatically on push

---

## Troubleshooting Deployment

### Frontend Build Issues

**Problem:** `npm run build` fails
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem:** Dark mode not working
```bash
# Ensure DarkModeContext is properly imported
# Check: src/context/DarkModeContext.jsx exists
# Check: App.jsx imports DarkModeProvider
```

---

### Backend Deployment Issues

**Problem:** `ModuleNotFoundError: No module named 'routes'`
```bash
# Solution: Ensure __init__.py exists in routes folder
touch backend/routes/__init__.py
```

**Problem:** CORS errors in production
```python
# In main.py, ensure origins include production domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.com",
        "http://localhost:3000"
    ],
    ...
)
```

**Problem:** MongoDB connection fails
```bash
# Check:
# 1. MONGO_URI is correct
# 2. IP whitelist includes server's IP
# 3. Database user has correct permissions
```

---

## Post-Deployment Verification

- [ ] Frontend loads without errors (http://your-domain.com)
- [ ] Dark mode toggle works
- [ ] Marks input works with percentage calculation
- [ ] Validation prevents invalid submissions
- [ ] API endpoint responds correctly
- [ ] Predictions are accurate
- [ ] MongoDB stores percentage fields
- [ ] Logs show no errors
- [ ] Performance is acceptable (<2s page load)

---

## Rollback Plan

If issues occur after deployment:

### Rollback Frontend
```bash
# Redeploy previous build
vercel --prod deploy path/to/previous/build

# Or use Vercel dashboard to rollback
# Deployments > Select previous > Promote
```

### Rollback Backend
```bash
# Restart with previous version
git checkout <previous-commit>
git push

# Render/Railway will auto-redeploy from git
```

---

## Monitoring

### Frontend Monitoring
- Check browser console for errors (F12)
- Monitor network requests (Network tab)
- Track page load time (Performance tab)

### Backend Monitoring
```bash
# Monitor logs
tail -f backend/logs/predictions_*.log

# Monitor requests
# Check /docs (Swagger UI) for API status

# Monitor database
# Count predictions: db.predictions.countDocuments()
```

---

## Support & Contact

- **Frontend Issues:** Check browser console, clear cache
- **Backend Issues:** Check logs, verify MongoDB connection
- **Dark Mode Issues:** Clear localStorage
- **Deployment Issues:** Check environment variables

---

## Deployment Checklist

### Before Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] No console errors
- [ ] Database migration (if needed)
- [ ] Environment variables prepared

### During Deployment
- [ ] Build completes successfully
- [ ] No deployment errors
- [ ] Services start correctly

### After Deployment
- [ ] Smoke tests pass
- [ ] All features working
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Rollback plan tested

---

**Status:** ✅ Ready for Deployment  
**Last Updated:** November 19, 2025  
**Version:** 1.1.0
