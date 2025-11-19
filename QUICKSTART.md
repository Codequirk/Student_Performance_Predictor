# Quick Start Guide

## 🚀 Start Here!

This is the fastest way to get the Student Performance Predictor running on your machine.

### Prerequisites (5 minutes)
- Python 3.10+ (download from https://python.org)
- Node.js 16+ (download from https://nodejs.org)
- MongoDB Atlas account (free at https://mongodb.com/cloud/atlas)

### Complete Setup (10-15 minutes)

#### 1. Train ML Model (First Time Only!)
```bash
cd model
python train_model.py
# Wait 2-3 minutes for training to complete
```

#### 2. Start Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Edit .env and add your MongoDB URI
# Get it from MongoDB Atlas

uvicorn main:app --reload
# Backend runs on http://localhost:8000
```

#### 3. Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

#### 4. Test It!
1. Open http://localhost:3000
2. Click "Predict"
3. Fill in sample data:
   - Attendance: 85
   - Assignment Score: 78
   - Internal Marks: 45
   - Previous CGPA: 8.2
   - Study Hours: 4.5
   - Sleep Hours: 7.0
4. Click "Predict Performance"
5. See the results!

---

## 📚 Documentation

- **README.md** - Full project overview
- **SETUP.md** - Detailed step-by-step setup guide
- **API_DOCS.md** - Complete API reference
- **postman_collection.json** - Pre-built API requests

---

## 🔧 Configuration

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_performance
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

### Frontend (.env, optional)
```
REACT_APP_API_URL=http://localhost:8000
```

---

## 📊 What to Expect

### Frontend Pages
1. **Home** - Overview and feature explanation
2. **Predict** - Input form for predictions
3. **Dashboard** - Model metrics and analytics

### API Endpoints
- `GET /` - Health check
- `POST /predict` - Make prediction
- `GET /model-info` - Model information
- `GET /model-info/metrics` - Performance metrics

---

## 🔍 Verify Everything Works

### Backend
```bash
# Should return {"message": "Student Performance Predictor API is running!"}
curl http://localhost:8000

# Should show Swagger UI
# http://localhost:8000/docs
```

### Frontend
```bash
# Should open in browser automatically
# http://localhost:3000
```

### Database
```bash
# Check MongoDB Atlas
# Collections should appear after first prediction
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Run `pip install -r requirements.txt` |
| Port 8000 in use | Change port: `uvicorn main:app --port 8001` |
| MongoDB connection error | Check .env MONGO_URI and Atlas whitelist |
| Model not found | Run `python model/train_model.py` first |
| CORS error | Backend CORS is enabled, check API URL |

---

## 📱 Sample Predictions

### Excellent Student
```json
{
  "attendance": 92,
  "assignment_score": 95,
  "internal_marks": 48,
  "prev_cgpa": 9.1,
  "study_hours": 6.0,
  "sleep_hours": 7.5
}
```
**Expected**: Excellent (85-95%)

### Good Student
```json
{
  "attendance": 85,
  "assignment_score": 78,
  "internal_marks": 45,
  "prev_cgpa": 8.2,
  "study_hours": 4.5,
  "sleep_hours": 7.0
}
```
**Expected**: Good (70-80%)

### Average Student
```json
{
  "attendance": 72,
  "assignment_score": 65,
  "internal_marks": 38,
  "prev_cgpa": 6.8,
  "study_hours": 3.0,
  "sleep_hours": 6.5
}
```
**Expected**: Average (55-70%)

### Poor Student
```json
{
  "attendance": 58,
  "assignment_score": 52,
  "internal_marks": 35,
  "prev_cgpa": 5.5,
  "study_hours": 2.5,
  "sleep_hours": 6.0
}
```
**Expected**: Poor (40-55%)

---

## 📞 Need Help?

1. Read SETUP.md for detailed step-by-step instructions
2. Check API_DOCS.md for API details
3. Review error messages in terminal
4. Check browser console (F12) for frontend errors
5. Verify all environment variables are set

---

## 🎯 Next Steps After Setup

1. ✅ Explore the Swagger UI at http://localhost:8000/docs
2. ✅ Import postman_collection.json into Postman
3. ✅ Try different prediction inputs
4. ✅ Check MongoDB Atlas for stored records
5. ✅ Customize styling in `frontend/src/index.css`
6. ✅ Deploy to cloud (see README.md)

---

**Happy Predicting! 🚀**

For complete documentation, see README.md
