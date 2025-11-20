# 🧪 Testing Guide - Student Performance Predictor v2.0

**Date:** November 19, 2025  
**Status:** Ready for Testing  
**Coverage:** All 12 features

---

## ✅ Pre-Testing Checklist

- [ ] Backend server running (`python -m uvicorn main:app --reload`)
- [ ] Frontend dev server running (`npm start`)
- [ ] MongoDB connection active
- [ ] All dependencies installed
- [ ] Environment variables configured

---

## 🔧 Backend Testing

### 1. Health Check
**Endpoint:** `GET /`

```bash
curl http://localhost:8000/
# Expected: {"message": "Student Performance Predictor API is running!"}
```

### 2. Student Prediction (NEW FORMAT)
**Endpoint:** `POST /predict`

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "student_name": "Test Student",
    "roll_number": "21CS001",
    "attendance": 85,
    "prev_cgpa": 8.2,
    "study_hours": 5,
    "sleep_hours": 7,
    "assignments": [
      {"subject_name": "Math", "marks_obtained": 88},
      {"subject_name": "Physics", "marks_obtained": 85}
    ],
    "subjects": [
      {"subject_name": "Math", "marks": 82},
      {"subject_name": "Physics", "marks": 78},
      {"subject_name": "Chemistry", "marks": 80}
    ]
  }'
```

**Expected Response:**
- Status: 200 OK
- Contains: `predicted_score`, `predicted_category`, `subject_performance`, `study_recommendations`
- Verify: Recommendations are generated based on performance gaps

**Test Case Variations:**
- ✅ Test with 1 assignment, 1 subject
- ✅ Test with multiple subjects and assignments
- ✅ Test with low marks (should generate strong recommendations)
- ❌ Test with empty assignments array (should fail - validation)
- ❌ Test with missing required fields (should fail - 422)

---

### 3. Teacher Registration
**Endpoint:** `POST /teacher/register`

```bash
curl -X POST http://localhost:8000/teacher/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testteacher@school.com",
    "password": "testpass123",
    "full_name": "Test Teacher",
    "school_name": "Test School"
  }'
```

**Expected Response:**
- Status: 200 OK
- Contains: `access_token`, `token_type` (bearer), `teacher_email`
- Token should be valid JWT

**Test Cases:**
- ✅ Register with valid data
- ❌ Register with duplicate email (should fail - 400)
- ❌ Register with password < 6 chars (should fail - 422)
- ❌ Register with invalid email format (should fail - 422)

---

### 4. Teacher Login
**Endpoint:** `POST /teacher/login`

```bash
curl -X POST http://localhost:8000/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testteacher@school.com",
    "password": "testpass123"
  }'
```

**Expected Response:**
- Status: 200 OK
- Contains: `access_token`, `token_type`, `teacher_email`
- Should return valid JWT

**Test Cases:**
- ✅ Login with correct credentials
- ❌ Login with wrong password (should fail - 401)
- ❌ Login with non-existent email (should fail - 401)

---

### 5. Get Teacher Info
**Endpoint:** `GET /teacher/me`

**With Valid Token:**
```bash
curl -X GET http://localhost:8000/teacher/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
- Status: 200 OK
- Contains: `email`, `full_name`, `school_name`, `created_at`

**Test Cases:**
- ✅ With valid token from login
- ❌ With invalid token (should fail - 401)
- ❌ Without Authorization header (should fail - 401)

---

### 6. CSV Template Download
**Endpoint:** `GET /teacher/upload/download-template`

```bash
curl -X GET http://localhost:8000/teacher/upload/download-template \
  -o template.csv
```

**Expected Response:**
- Status: 200 OK
- Downloads valid CSV file
- Contains 3 example students
- Column headers: student_name, roll_number, attendance, prev_cgpa, study_hours, sleep_hours, etc.

---

### 7. CSV Upload & Batch Processing
**Endpoint:** `POST /teacher/upload/csv`

**First, get a token:**
```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:8000/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testteacher@school.com",
    "password": "testpass123"
  }' | jq -r '.access_token')

# 2. Download template
curl -X GET http://localhost:8000/teacher/upload/download-template \
  -o students.csv

# 3. Upload template (or modified CSV)
curl -X POST http://localhost:8000/teacher/upload/csv \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@students.csv"
```

**Expected Response:**
- Status: 200 OK
- Contains: `status`, `total_processed`, `results` array
- Each result has: `student_name`, `predicted_score`, `predicted_category`, `probabilities`

**Test Cases:**
- ✅ Upload valid CSV with template data
- ✅ Upload CSV with custom student data
- ❌ Upload without authentication (should fail - 401)
- ❌ Upload invalid CSV (should fail - 400)

---

### 8. Model Info
**Endpoint:** `GET /model-info`

```bash
curl http://localhost:8000/model-info
```

**Expected Response:**
- Status: 200 OK
- Contains: `model_type`, `accuracy`, `features`, `classes`, `trained_at`

---

## 💻 Frontend Testing

### 1. Navigation & Layout
- [ ] Click "Home" - should load home page
- [ ] Click "Predict" - should load prediction form
- [ ] Click "Dashboard" - should load admin dashboard
- [ ] Click "Teacher Portal" - should redirect to teacher login
- [ ] Footer displays correctly with all links

### 2. Student Prediction Form (NEW)
**Path:** `/predict`

**Visual Tests:**
- [ ] Form loads with empty fields
- [ ] Basic info section displays (student name, roll number)
- [ ] Range sliders work:
  - [ ] Attendance (0-100%)
  - [ ] CGPA (0-10)
  - [ ] Study Hours (0-24)
  - [ ] Sleep Hours (0-24)
- [ ] Blue section: "Assignments" visible with "Add Assignment" button
- [ ] Green section: "Subjects" visible with "Add Subject" button

**Dynamic Input Tests:**
```
Starting state: 1 assignment, 1 subject
1. Click "+ Add Assignment"
   - Expected: New assignment row appears
2. Enter values in all assignments:
   - Subject names: "Math", "Physics"
   - Marks: 85, 90
3. Click "+ Add Subject"
   - Expected: New subject row appears
4. Enter values in all subjects:
   - Subject names: "Math", "Physics", "Chemistry"
   - Marks: 80, 75, 88
5. Click "Get Prediction"
   - Expected: Form validates and submits
```

**Validation Tests:**
- [ ] Try submitting with empty subject name → Error appears
- [ ] Try submitting with empty assignment → Error appears
- [ ] Try removing last assignment → "Remove" button disabled
- [ ] Try removing last subject → "Remove" button disabled
- [ ] Enter non-numeric marks → Marks default to 0

### 3. Results Display (NEW)
**After successful prediction:**

**Visualizations:**
- [ ] Subject Performance Histogram displays
  - [ ] Shows all subjects
  - [ ] Color coding: Green (≥80), Yellow (60-79), Red (<60)
  - [ ] Average marks displayed
- [ ] Scatter Plot shows
  - [ ] X-axis: Study hours allocated
  - [ ] Y-axis: Marks obtained
  - [ ] Two series: Assignments (blue), Subjects (green)

**Recommendations:**
- [ ] Study recommendations box appears with blue border
- [ ] Each recommendation shows:
  - [ ] Subject name
  - [ ] Performance assessment ("below average", "good")
  - [ ] Recommended study time increase or "Maintain same schedule"

**Subject Performance Details:**
- [ ] Table shows all subjects with:
  - [ ] Subject name
  - [ ] Marks
  - [ ] Performance flag: GOOD/AVERAGE/POOR with color badge
- [ ] Original probability distribution still visible

**Navigation:**
- [ ] "Back to Form" button works
- [ ] Clicking it clears results and returns to form

### 4. Teacher Registration
**Path:** `/teacher/register`

**Form Tests:**
```
Successful Registration:
1. Enter: name, school, email, password, confirm password
2. Click "Create Account"
3. Success message appears: "✅ Registration successful!"
4. After 1.5 seconds, redirects to /teacher/dashboard
```

**Validation Tests:**
- [ ] Empty fields show error messages
- [ ] Password < 6 chars shows "Password must be at least 6 characters"
- [ ] Passwords don't match shows "Passwords do not match"
- [ ] Invalid email format shows error
- [ ] Duplicate email shows: "Email already registered"

**Links:**
- [ ] "Login here" link works → goes to /teacher/login

### 5. Teacher Login
**Path:** `/teacher/login`

**Successful Login:**
```
1. Enter registered email
2. Enter password
3. Click "Sign In"
4. Token saved to localStorage
5. Redirects to /teacher/dashboard
```

**Validation Tests:**
- [ ] Empty email shows error
- [ ] Empty password shows error
- [ ] Wrong credentials show: "Invalid email or password"
- [ ] Multiple failed attempts still work (no lockout)

**Links:**
- [ ] "Register here" link works → goes to /teacher/register

### 6. Teacher Dashboard
**Path:** `/teacher/dashboard`

**Header Tests:**
- [ ] Page title: "Teacher Dashboard"
- [ ] Shows teacher info:
  - [ ] Name
  - [ ] School
  - [ ] Email
- [ ] "Logout" button visible

**Upload Section:**
- [ ] Instructions display
- [ ] "Download CSV Template" button works → downloads template.csv
- [ ] File input accepts .csv files
- [ ] File input shows selected filename

**Upload Process:**
```
1. Click "Download CSV Template"
2. Select the downloaded file
3. Filename displays: "Selected: student_template.csv"
4. Click "Upload & Process"
5. Loading state: "Processing..."
6. Success message: "✅ Successfully processed X students!"
```

**Results Table:**
After upload succeeds:
- [ ] Summary cards show:
  - [ ] Total Processed
  - [ ] Success count
  - [ ] Error count
- [ ] Results table displays:
  - [ ] Student Name
  - [ ] Roll Number
  - [ ] Attendance
  - [ ] Predicted Category (colored: green/yellow/red)
  - [ ] Score
  - [ ] Confidence percentage
  - [ ] Status (✅ Success or ❌ Error)
- [ ] "Download Results" button visible

**Error Handling:**
- [ ] Try uploading without file → Error: "Please select a CSV file"
- [ ] Try uploading non-CSV → Error: "Please select a CSV file"
- [ ] Try without authentication → Redirects to login

### 7. Logout Test
**On Dashboard:**
```
1. Click "Logout" button
2. localStorage cleared
3. Redirected to /teacher/login
4. Try going back to /teacher/dashboard → Redirected to login
```

---

## 📱 End-to-End Test Scenarios

### Scenario 1: Complete Student Workflow
```
1. Go to Home page → ✅ Displays welcome and features
2. Click "Predict" → ✅ Form loads
3. Fill in student info (dynamic assignments & subjects) → ✅ Form accepts input
4. Click "Get Prediction" → ✅ Prediction succeeds
5. View results with visualizations → ✅ All charts display
6. See recommendations → ✅ Personalized suggestions show
7. Click "Back to Form" → ✅ Returns to form
```

### Scenario 2: Complete Teacher Workflow
```
1. Click "Teacher Portal" → ✅ Redirects to login
2. Click "Register here" → ✅ Goes to register page
3. Register new account → ✅ Account created, token saved
4. Auto-redirected to dashboard → ✅ Dashboard loads
5. See teacher info → ✅ Correct name, school, email
6. Download CSV template → ✅ File downloads
7. Upload CSV → ✅ Processing starts
8. See batch results → ✅ Results table shows predictions
9. Download results → ✅ CSV file downloads
10. Click "Logout" → ✅ Session cleared, back to login
```

### Scenario 3: Teacher Re-authentication
```
1. Register teacher account
2. Note the token
3. Close browser (simulate session loss)
4. Go to /teacher/dashboard → ✅ Redirects to login (no token)
5. Login with same credentials → ✅ New token generated
6. Access dashboard again → ✅ Works with new token
```

---

## 🐛 Bug Scenarios to Check

### Form Issues
- [ ] Adding/removing assignments/subjects works smoothly
- [ ] Form doesn't allow empty subject names
- [ ] Marks stay within 0-100 range
- [ ] Min 1 assignment and 1 subject enforced

### Visualization Issues
- [ ] Scatter plot renders with correct data
- [ ] Histogram colors update based on marks
- [ ] Both visualizations responsive on mobile

### Authentication Issues
- [ ] Expired token shows clear error message
- [ ] Invalid token redirects to login
- [ ] Multiple login attempts work
- [ ] Token persists across page refreshes

### CSV Processing Issues
- [ ] CSV with extra columns processes correctly
- [ ] CSV with missing columns shows error
- [ ] Individual row errors don't stop batch
- [ ] Large CSV files process without timeout

---

## 🧮 Data Validation Tests

### Valid Inputs
```
Attendance: 0, 50, 85, 100 ✅
CGPA: 0, 5.5, 8.2, 10 ✅
Study Hours: 0, 3.5, 10, 24 ✅
Sleep Hours: 0, 4, 7, 12 ✅
Marks: 0, 50, 75, 100 ✅
```

### Invalid Inputs (Should Fail)
```
Attendance: -1, 101, "text", null ❌
CGPA: -1, 11, "text", null ❌
Marks: -1, 101, "text", null ❌
Empty assignments array ❌
Empty subjects array ❌
Empty student name ❌
```

---

## 📊 Performance Tests

- [ ] Form with 10+ assignments loads quickly
- [ ] Form with 10+ subjects loads quickly
- [ ] Visualizations render within 500ms
- [ ] CSV with 100+ students processes within 5 seconds
- [ ] Page navigation is responsive (< 100ms)

---

## ✨ Browser Compatibility

Test on:
- [ ] Chrome/Chromium (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] No unhandled promise rejections
- [ ] Environment variables set correctly
- [ ] MongoDB backup created
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] SSL/TLS enabled
- [ ] Logging enabled
- [ ] Error tracking configured

---

## 📝 Test Results Template

**Test Date:** ___________  
**Tester:** ___________  
**Browser:** ___________  
**OS:** ___________

| Test | Status | Notes |
|------|--------|-------|
| Health Check | ✅/❌ | |
| Student Prediction | ✅/❌ | |
| Teacher Registration | ✅/❌ | |
| Teacher Login | ✅/❌ | |
| CSV Upload | ✅/❌ | |
| Visualizations | ✅/❌ | |
| Recommendations | ✅/❌ | |
| Logout | ✅/❌ | |

**Issues Found:**
1. ___________________
2. ___________________
3. ___________________

---

**Ready to Test! 🚀**
