from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
import joblib
import numpy as np
from utils.logger import log_prediction
from datetime import datetime
from pymongo import MongoClient
import os
from typing import List, Optional

router = APIRouter(prefix="/predict", tags=["Prediction"])

class Assignment(BaseModel):
    subject_name: str = Field(..., description="Assignment subject")
    marks_obtained: float = Field(..., ge=0, description="Marks obtained")
    marks_total: float = Field(..., gt=0, description="Total marks")
    
    @validator('marks_obtained')
    def validate_marks_obtained(cls, v, values):
        if 'marks_total' in values and v > values['marks_total']:
            raise ValueError("Marks obtained cannot exceed total marks")
        return v

class Subject(BaseModel):
    subject_name: str = Field(..., description="Subject name")
    marks_obtained: float = Field(..., ge=0, description="Marks obtained")
    marks_total: float = Field(..., gt=0, description="Total marks")
    
    @validator('marks_obtained')
    def validate_marks_obtained(cls, v, values):
        if 'marks_total' in values and v > values['marks_total']:
            raise ValueError("Marks obtained cannot exceed total marks")
        return v

class PredictRequest(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage (0-100)")
    prev_cgpa: float = Field(..., ge=0, le=10, description="Previous semester CGPA (0-10)")
    study_hours: float = Field(..., ge=0, le=24, description="Study hours per day (0-24)")
    sleep_hours: float = Field(..., ge=0, le=24, description="Sleep hours per day (0-24)")
    assignments: List[Assignment] = Field(..., min_items=1, description="List of assignments")
    subjects: List[Subject] = Field(..., min_items=1, description="List of subjects")
    student_name: str = Field(default="Anonymous", description="Student name")
    roll_number: str = Field(default="N/A", description="Roll number")
    
    @validator('assignments', 'subjects')
    def validate_not_empty(cls, v):
        if not v:
            raise ValueError("Must provide at least one assignment and subject")
        return v

class SubjectPerformance(BaseModel):
    subject_name: str
    marks: float
    performance_flag: str  # GOOD, AVERAGE, POOR
    pass_fail_status: str  # PASS or FAIL

class PredictResponse(BaseModel):
    predicted_score: float
    predicted_category: str
    probabilities: dict
    message: str
    subject_performance: List[SubjectPerformance] = []
    study_recommendations: List[str] = []

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
    Predict student performance based on input features including dynamic assignments and subjects.
    Marks obtained and total marks are converted to percentages before model prediction.
    """
    
    if model is None or scaler is None or le is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please ensure model.pkl exists.")
    
    try:
        # Convert marks to percentages
        assignment_percentage = np.mean([
            (a.marks_obtained / a.marks_total) * 100 for a in data.assignments
        ])
        subject_percentage = np.mean([
            (s.marks_obtained / s.marks_total) * 100 for s in data.subjects
        ])
        
        # Internal marks approximation from assignment percentage
        internal_marks = min(50, assignment_percentage * 0.5)
        
        # Prepare feature array (6 features for model)
        X = np.array([[
            data.attendance,
            assignment_percentage,
            internal_marks,
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
        pred_score = float(np.dot(pred_proba, [55, 80, 35]))
        pred_score = min(100, max(0, pred_score))
        
        # Calculate subject performance flags and pass/fail status
        subject_avg = subject_percentage
        subject_performance = []
        for subject in data.subjects:
            subject_percent = (subject.marks_obtained / subject.marks_total) * 100
            if subject_percent >= 80:
                flag = "GOOD"
            elif subject_percent >= 60:
                flag = "AVERAGE"
            else:
                flag = "POOR"
            # Pass if >= 40%, Fail if < 40%
            pass_fail = "PASS" if subject_percent >= 40 else "FAIL"
            subject_performance.append(SubjectPerformance(
                subject_name=subject.subject_name,
                marks=subject_percent,
                performance_flag=flag,
                pass_fail_status=pass_fail
            ))
        
        # Generate study time recommendations
        study_recommendations = []
        for subject in data.subjects:
            subject_percent = (subject.marks_obtained / subject.marks_total) * 100
            if subject_percent < subject_avg:
                gap = subject_avg - subject_percent
                recommended_increase = round(gap / 20, 1)  # Proportional increase
                study_recommendations.append(
                    f"{subject.subject_name}: Your score is below average. "
                    f"Increase study time by +{recommended_increase} hrs/day."
                )
            elif subject_percent >= 80:
                study_recommendations.append(
                    f"{subject.subject_name}: Your score is good. Maintain same schedule."
                )
        
        # Prepare record for MongoDB
        record = {
            "student_name": data.student_name,
            "roll_number": data.roll_number,
            "attendance": data.attendance,
            "assignment_percentage": round(assignment_percentage, 2),
            "subject_percentage": round(subject_percentage, 2),
            "prev_cgpa": data.prev_cgpa,
            "study_hours": data.study_hours,
            "sleep_hours": data.sleep_hours,
            "assignments": [
                {
                    "subject_name": a.subject_name,
                    "marks_obtained": a.marks_obtained,
                    "marks_total": a.marks_total,
                    "percentage": round((a.marks_obtained / a.marks_total) * 100, 2)
                }
                for a in data.assignments
            ],
            "subjects": [
                {
                    "subject_name": s.subject_name,
                    "marks_obtained": s.marks_obtained,
                    "marks_total": s.marks_total,
                    "percentage": round((s.marks_obtained / s.marks_total) * 100, 2)
                }
                for s in data.subjects
            ],
            "predicted_score": round(pred_score, 2),
            "predicted_category": pred_category,
            "subject_performance": [sp.dict() for sp in subject_performance],
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
            message=f"Prediction successful. Student {data.student_name} is predicted to score {pred_score:.2f}%",
            subject_performance=subject_performance,
            study_recommendations=study_recommendations
        )
    
    except Exception as e:
        log_prediction({"error": str(e), "data": data.dict()})
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
