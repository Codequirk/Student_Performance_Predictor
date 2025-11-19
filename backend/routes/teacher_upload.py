"""Teacher CSV Processing Route"""

from fastapi import APIRouter, HTTPException, File, UploadFile, Header, Depends
from fastapi.responses import StreamingResponse
import csv
import io
import joblib
import numpy as np
import os
from pymongo import MongoClient
from datetime import datetime
from utils.jwt_handler import decode_token
import json

router = APIRouter(prefix="/teacher/upload", tags=["Teacher"])

def get_current_teacher_email(authorization: str = Header(None)):
    """Extract teacher email from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return payload.get("email")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def load_ml_model():
    """Load trained ML model"""
    try:
        model = joblib.load("model/model.pkl")
        scaler = joblib.load("model/scaler.pkl")
        le = joblib.load("model/label_encoder.pkl")
        return model, scaler, le
    except:
        return None, None, None

@router.post("/csv", summary="Upload and process CSV for batch predictions")
async def process_csv(
    file: UploadFile = File(...),
    email: str = Depends(get_current_teacher_email)
):
    """
    Process CSV file with student data and generate batch predictions.
    
    CSV Format:
    student_name, roll_number, attendance, prev_cgpa, study_hours, sleep_hours, subject1_marks, subject2_marks, ..., assignment1_marks, assignment2_marks, ...
    """
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be in CSV format")
    
    try:
        # Read CSV file
        contents = await file.read()
        csv_text = contents.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_text))
        
        if not csv_reader.fieldnames:
            raise HTTPException(status_code=400, detail="Invalid CSV format")
        
        # Load model
        model, scaler, le = load_ml_model()
        if not model:
            raise HTTPException(status_code=500, detail="ML model not loaded")
        
        results = []
        
        for row in csv_reader:
            try:
                # Extract basic fields
                student_name = row.get("student_name", "Unknown")
                roll_number = row.get("roll_number", "N/A")
                attendance = float(row.get("attendance", 0))
                prev_cgpa = float(row.get("prev_cgpa", 0))
                study_hours = float(row.get("study_hours", 0))
                sleep_hours = float(row.get("sleep_hours", 0))
                
                # Extract subject marks (all columns with "subject" prefix)
                subject_marks = [float(v) for k, v in row.items() if k.startswith("subject") and v]
                
                # Extract assignment marks (all columns with "assignment" prefix)
                assignment_marks = [float(v) for k, v in row.items() if k.startswith("assignment") and v]
                
                if not subject_marks or not assignment_marks:
                    results.append({
                        "student_name": student_name,
                        "roll_number": roll_number,
                        "error": "Missing subject or assignment marks"
                    })
                    continue
                
                # Calculate averages
                avg_assignment = np.mean(assignment_marks)
                avg_subject = np.mean(subject_marks)
                internal_marks = min(50, avg_assignment * 0.5)
                
                # Prepare feature array
                X = np.array([[
                    attendance,
                    avg_assignment,
                    internal_marks,
                    prev_cgpa,
                    study_hours,
                    sleep_hours
                ]])
                
                X_scaled = scaler.transform(X)
                pred_label = model.predict(X_scaled)[0]
                pred_proba = model.predict_proba(X_scaled)[0]
                pred_category = le.inverse_transform([pred_label])[0]
                
                # Calculate score
                pred_score = float(np.dot(pred_proba, [55, 80, 35]))
                pred_score = min(100, max(0, pred_score))
                
                # Determine pass/fail based on average subject marks (>= 40% = PASS)
                pass_fail = "PASS" if avg_subject >= 40 else "FAIL"
                
                results.append({
                    "student_name": student_name,
                    "roll_number": roll_number,
                    "attendance": attendance,
                    "avg_assignment_marks": round(avg_assignment, 2),
                    "avg_subject_marks": round(avg_subject, 2),
                    "prev_cgpa": prev_cgpa,
                    "study_hours": study_hours,
                    "sleep_hours": sleep_hours,
                    "predicted_score": round(pred_score, 2),
                    "predicted_category": pred_category,
                    "pass_fail_status": pass_fail,
                    "probabilities": {
                        le.classes_[i]: round(float(pred_proba[i]), 4)
                        for i in range(len(le.classes_))
                    }
                })
                
            except ValueError as e:
                results.append({
                    "student_name": row.get("student_name", "Unknown"),
                    "roll_number": row.get("roll_number", "N/A"),
                    "error": f"Invalid data format: {str(e)}"
                })
                continue
        
        # Save results to MongoDB
        db = MongoClient(os.getenv("MONGO_URI")).get_database("student_performance")
        batch_record = {
            "teacher_email": email,
            "filename": file.filename,
            "total_students": len(results),
            "processed_at": datetime.utcnow(),
            "results": results
        }
        db["batch_predictions"].insert_one(batch_record)
        
        return {
            "status": "success",
            "total_processed": len(results),
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.get("/download-template", summary="Download CSV template")
async def download_template():
    """Download CSV template for batch uploads"""
    
    try:
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        headers = [
            "student_name",
            "roll_number",
            "attendance",
            "prev_cgpa",
            "study_hours",
            "sleep_hours",
            "subject1_marks",
            "subject2_marks",
            "subject3_marks",
            "assignment1_marks",
            "assignment2_marks",
            "pass_fail_prediction"
        ]
        writer.writerow(headers)
        
        # Write sample rows
        sample_rows = [
            ["Raj Kumar", "21CS001", "85", "8.2", "5.0", "7.0", "78", "82", "75", "90", "88", "PASS"],
            ["Priya Singh", "21CS002", "92", "9.1", "6.0", "8.0", "95", "92", "89", "95", "94", "PASS"],
            ["Amit Patel", "21CS003", "60", "7.0", "3.0", "6.0", "65", "68", "62", "70", "72", "PASS"]
        ]
        for row in sample_rows:
            writer.writerow(row)
        
        # Get CSV content
        csv_content = output.getvalue()
        output.close()
        
        # Convert to bytes and create streaming response
        csv_bytes = io.BytesIO(csv_content.encode('utf-8'))
        
        return StreamingResponse(
            iter([csv_bytes.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=student_batch_template.csv",
                "Content-Type": "text/csv"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating template: {str(e)}")
