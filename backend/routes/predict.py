from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
from utils.logger import log_prediction
from datetime import datetime
from pymongo import MongoClient
import os

router = APIRouter(prefix="/predict", tags=["Prediction"])

class PredictRequest(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage (0-100)")
    assignment_score: float = Field(..., ge=0, le=100, description="Assignment score (0-100)")
    internal_marks: float = Field(..., ge=0, le=50, description="Internal marks (0-50)")
    prev_cgpa: float = Field(..., ge=0, le=10, description="Previous semester CGPA (0-10)")
    study_hours: float = Field(..., ge=0, le=24, description="Study hours per day (0-24)")
    sleep_hours: float = Field(..., ge=0, le=24, description="Sleep hours per day (0-24)")
    student_name: str = Field(default="Anonymous", description="Student name")
    roll_number: str = Field(default="N/A", description="Roll number")

class PredictResponse(BaseModel):
    predicted_score: float
    predicted_category: str
    probabilities: dict
    message: str

# Load model and preprocessors
try:
    model = joblib.load("model/model.pkl")
    scaler = joblib.load("model/scaler.pkl")
    le = joblib.load("model/label_encoder.pkl")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    scaler = None
    le = None

# MongoDB setup
def get_mongo_connection():
    try:
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        client = MongoClient(mongo_uri)
        db = client["student_performance"]
        return db
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return None

@router.post("/", response_model=PredictResponse, summary="Predict student performance")
def predict_performance(data: PredictRequest):
    """
    Predict student performance based on input features.
    
    - **attendance**: Attendance percentage (0-100)
    - **assignment_score**: Assignment score (0-100)
    - **internal_marks**: Internal marks (0-50)
    - **prev_cgpa**: Previous semester CGPA (0-10)
    - **study_hours**: Daily study hours (0-24)
    - **sleep_hours**: Daily sleep hours (0-24)
    """
    
    if model is None or scaler is None or le is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please ensure model.pkl exists.")
    
    try:
        X = np.array([[
            data.attendance,
            data.assignment_score,
            data.internal_marks,
            data.prev_cgpa,
            data.study_hours,
            data.sleep_hours
        ]])
        
        X_scaled = scaler.transform(X)
        pred_label = model.predict(X_scaled)[0]
        pred_proba = model.predict_proba(X_scaled)[0]
        pred_category = le.inverse_transform([pred_label])[0]
        
        # Calculate weighted score (3 categories: Average=0, Good=1, Poor=2)
        score_mapping = {0: 55, 1: 80, 2: 35}  # Average, Good, Poor
        base_score = score_mapping.get(pred_label, 50)
        pred_score = float(np.dot(pred_proba, [55, 80, 35]))
        pred_score = min(100, max(0, pred_score))
        
        # Prepare record for MongoDB
        record = {
            "student_name": data.student_name,
            "roll_number": data.roll_number,
            "attendance": data.attendance,
            "assignment_score": data.assignment_score,
            "internal_marks": data.internal_marks,
            "prev_cgpa": data.prev_cgpa,
            "study_hours": data.study_hours,
            "sleep_hours": data.sleep_hours,
            "predicted_score": round(pred_score, 2),
            "predicted_category": pred_category,
            "probabilities": {
                le.classes_[i]: round(float(pred_proba[i]), 4)
                for i in range(len(le.classes_))
            },
            "created_at": datetime.utcnow()
        }
        
        # Save to MongoDB
        db = get_mongo_connection()
        if db is not None:
            try:
                db["predictions"].insert_one(record)
            except Exception as mongo_err:
                print(f"MongoDB insert error: {mongo_err}")
        
        log_prediction(record)
        
        return PredictResponse(
            predicted_score=round(pred_score, 2),
            predicted_category=pred_category,
            probabilities={
                str(le.classes_[i]): round(float(pred_proba[i]), 4)
                for i in range(len(le.classes_))
            },
            message=f"Prediction successful. Student {data.student_name} is predicted to score {pred_score:.2f}%"
        )
    
    except Exception as e:
        log_prediction({"error": str(e), "data": data.dict()})
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
