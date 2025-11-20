# 📖 Student Performance Predictor - API Documentation

**Version:** 1.1.0  
**Last Updated:** November 19, 2025

Complete API reference for the Student Performance Predictor backend with teacher portal and batch processing features.

## Base URL
```
http://localhost:8000
```

## Authentication
### Teacher Endpoints
Most teacher endpoints require JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer {access_token}
```

## Response Format
All responses are in JSON format.

---

---

## Student Prediction Endpoints

### 1. Predict Student Performance (NEW - Dynamic Input Format)

#### POST /predict
**Description**: Predict a student's performance based on dynamic assignments and subjects.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body** (NEW - Dynamic Arrays):
```json
{
  "student_name": "John Doe",
  "roll_number": "21CS001",
  "attendance": 85,
  "prev_cgpa": 8.2,
  "study_hours": 5,
  "sleep_hours": 7,
  "assignments": [
    {"subject_name": "Mathematics", "marks_obtained": 88},
    {"subject_name": "Physics", "marks_obtained": 85}
  ],
  "subjects": [
    {"subject_name": "Mathematics", "marks": 82},
    {"subject_name": "Physics", "marks": 78},
    {"subject_name": "Chemistry", "marks": 80}
  ]
}
```

**Response** (Success):
```json
{
  "student_name": "John Doe",
  "roll_number": "21CS001",
  "predicted_score": 75.5,
  "predicted_category": "Good",
  "probabilities": {"Average": 0.15, "Good": 0.70, "Poor": 0.15},
  "subject_performance": [
    {"subject_name": "Mathematics", "marks": 82, "performance_flag": "GOOD"},
    {"subject_name": "Physics", "marks": 78, "performance_flag": "AVERAGE"},
    {"subject_name": "Chemistry", "marks": 80, "performance_flag": "GOOD"}
  ],
  "study_recommendations": [
    "Physics: Your score is below average. Increase study time by +1.0 hrs/day.",
    "Chemistry: Your score is good. Maintain same schedule."
  ]
}
```

---

## Endpoints

### 2. Health Check

#### GET /
**Description**: Check if API is running

**Response**:
```json
{
  "message": "Student Performance Predictor API is running!"
}
```

**Status Code**: `200 OK`

---

### 3. Teacher Registration

#### POST /teacher/register
**Description**: Create a new teacher account.

**Request Body**:
```json
{
  "email": "teacher@school.com",
  "password": "securepass123",
  "full_name": "Mr. Smith",
  "school_name": "ABC High School"
}
```

**Response** (Success):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "teacher_email": "teacher@school.com"
}
```

---

### 4. Teacher Login

#### POST /teacher/login
**Description**: Authenticate teacher and get JWT token.

**Request Body**:
```json
{
  "email": "teacher@school.com",
  "password": "securepass123"
}
```

**Response** (Success):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "teacher_email": "teacher@school.com"
}
```

---

### 5. Get Teacher Info

#### GET /teacher/me
**Description**: Get current teacher information (requires JWT token).

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "email": "teacher@school.com",
  "full_name": "Mr. Smith",
  "school_name": "ABC High School",
  "created_at": "2025-11-19T10:30:00"
}
```

---

### 6. Upload and Process CSV

#### POST /teacher/upload/csv
**Description**: Upload CSV with student data and process batch predictions.

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**CSV Format**:
Columns: student_name, roll_number, attendance, prev_cgpa, study_hours, sleep_hours, subject*_marks, assignment*_marks

**Response** (Success):
```json
{
  "status": "success",
  "total_processed": 3,
  "results": [
    {
      "student_name": "John Doe",
      "roll_number": "21CS001",
      "attendance": 85,
      "predicted_score": 75.5,
      "predicted_category": "Good",
      "probabilities": {"Average": 0.15, "Good": 0.70, "Poor": 0.15}
    }
  ]
}
```

---

### 7. Download CSV Template

#### GET /teacher/upload/download-template
**Description**: Download sample CSV template file.

**Response**: CSV file download

---

### 8. Get Model Information

#### GET /model-info
**Description**: Get information about the trained model

**Response**:
````

**Status Codes**:
- `200 OK` - Prediction successful
- `422 Unprocessable Entity` - Validation error (invalid input)
- `500 Internal Server Error` - Server error

**Example cURL**:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "attendance": 85,
    "assignment_score": 78,
    "internal_marks": 45,
    "prev_cgpa": 8.2,
    "study_hours": 4.5,
    "sleep_hours": 7.0,
    "student_name": "John Doe",
    "roll_number": "20CS001"
  }'
```

**Example Python**:
```python
import requests

url = "http://localhost:8000/predict"
data = {
    "attendance": 85,
    "assignment_score": 78,
    "internal_marks": 45,
    "prev_cgpa": 8.2,
    "study_hours": 4.5,
    "sleep_hours": 7.0,
    "student_name": "John Doe",
    "roll_number": "20CS001"
}

response = requests.post(url, json=data)
print(response.json())
```

---

### 3. Get Model Information

#### GET /model-info
**Description**: Get information about the trained model

**Response**:
```json
{
  "model_name": "Random Forest Classifier",
  "accuracy": 0.89,
  "features": [
    "attendance",
    "assignment_score",
    "internal_marks",
    "prev_cgpa",
    "study_hours",
    "sleep_hours"
  ],
  "labels": [
    "Poor",
    "Average",
    "Good",
    "Excellent"
  ],
  "version": "1.0.0"
}
```

**Status Code**: `200 OK`

**Example cURL**:
```bash
curl http://localhost:8000/model-info
```

---

### 4. Get Model Metrics

#### GET /model-info/metrics
**Description**: Get detailed model performance metrics

**Response**:
```json
{
  "accuracy": 0.89,
  "precision": 0.88,
  "recall": 0.87,
  "f1_score": 0.87,
  "confusion_matrix": "See admin dashboard for visualization",
  "training_samples": 500,
  "test_samples": 100
}
```

**Status Code**: `200 OK`

**Example cURL**:
```bash
curl http://localhost:8000/model-info/metrics
```

---

### 5. Get Training Status

#### GET /train/status
**Description**: Get information about model training status

**Response**:
```json
{
  "last_trained": "2025-11-18",
  "status": "completed",
  "samples_used": 500,
  "model_version": "1.0.0"
}
```

**Status Code**: `200 OK`

---

### 6. Retrain Model (Placeholder)

#### POST /train
**Description**: Request model retraining (not implemented in demo version)

**Response**:
```json
{
  "message": "Retraining not implemented in demo version.",
  "status": "pending",
  "instruction": "Run the training.ipynb notebook to retrain the model."
}
```

**Status Code**: `200 OK`

---

## Error Responses

### Validation Error (422)
```json
{
  "detail": [
    {
      "loc": ["body", "attendance"],
      "msg": "ensure this value is less than or equal to 100",
      "type": "value_error.number.not_le",
      "ctx": {"limit_value": 100}
    }
  ]
}
```

### Server Error (500)
```json
{
  "detail": "Prediction error: [error details]"
}
```

### Model Not Found (500)
```json
{
  "detail": "Model not loaded. Please ensure model.pkl exists."
}
```

---

## Data Types and Constraints

### Float Fields
- `attendance`: 0 ≤ value ≤ 100
- `assignment_score`: 0 ≤ value ≤ 100
- `internal_marks`: 0 ≤ value ≤ 50
- `prev_cgpa`: 0 ≤ value ≤ 10
- `study_hours`: 0 ≤ value ≤ 24
- `sleep_hours`: 0 ≤ value ≤ 24

### String Fields
- `student_name`: Max 255 characters
- `roll_number`: Max 50 characters

---

## Performance Categories

| Category | Score Range | Description |
|----------|------------|-------------|
| Poor | 0-50 | Needs improvement |
| Average | 50-65 | Satisfactory performance |
| Good | 65-80 | Strong performance |
| Excellent | 80-100 | Exceptional performance |

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, implement:
- 100 requests per minute per IP
- 10 requests per second per IP

---

## CORS Headers

All endpoints support CORS with these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Interactive API Documentation

### Swagger UI
Visit: `http://localhost:8000/docs`
- Try out all endpoints
- See request/response schemas
- View parameter details

### ReDoc
Visit: `http://localhost:8000/redoc`
- Read-only documentation
- Better for mobile devices

---

## Common API Patterns

### Successful Request Flow
```
Client → POST /predict (with valid data)
Server → Validate input
Server → Load model
Server → Make prediction
Server → Save to MongoDB
Server → Return results (200 OK)
```

### Error Request Flow
```
Client → POST /predict (with invalid data)
Server → Validate input
Server → Return error (422 Unprocessable Entity)
```

---

## Example API Workflows

### Workflow 1: Single Prediction
```bash
# Step 1: Make prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"attendance": 85, ...}'

# Step 2: Get results (from response)
# {
#   "predicted_score": 78.5,
#   "predicted_category": "Good",
#   ...
# }
```

### Workflow 2: Get Model Information
```bash
# Step 1: Get model details
curl http://localhost:8000/model-info

# Step 2: Get model metrics
curl http://localhost:8000/model-info/metrics

# Step 3: Display in UI
# Use this information in admin dashboard
```

---

## Postman Collection

Import `postman_collection.json` in Postman to test all endpoints:
1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Click "Import"
5. All endpoints will be available

---

## Client Libraries

### JavaScript/Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

const response = await api.post('/predict', {
  attendance: 85,
  assignment_score: 78,
  // ... other fields
});
```

### Python/Requests
```python
import requests

response = requests.post('http://localhost:8000/predict', json={
    'attendance': 85,
    'assignment_score': 78,
    # ... other fields
})
print(response.json())
```

### cURL
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"attendance": 85, ...}'
```

---

## API Versioning

Current version: `1.0.0`
- All endpoints are stable
- Breaking changes will increment major version

---

## Support

For API issues:
1. Check Swagger docs at `/docs`
2. Review error response details
3. Check server logs
4. Verify all inputs are within valid ranges

---

**API Documentation Version**: 1.0
**Last Updated**: November 18, 2025
