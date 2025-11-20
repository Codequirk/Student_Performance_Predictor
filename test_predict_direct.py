import sys
sys.path.insert(0, r'c:\Users\pragn.LAPTOP-DAHFBVDA\OneDrive\Documents\student2.0\backend')

import json
import pandas as pd
import numpy as np
from routes.predict import PredictRequest, predict_performance

# Create test data
test_data = {
    "student_name": "John Doe",
    "roll_number": "CS001",
    "assignments": [
        {"subject_name": "Math", "marks_obtained": 18, "marks_total": 20},
        {"subject_name": "English", "marks_obtained": 16, "marks_total": 20}
    ],
    "subjects": [
        {"subject_name": "Math", "marks_obtained": 18, "marks_total": 20},
        {"subject_name": "English", "marks_obtained": 16, "marks_total": 20}
    ],
    "attendance": 85,
    "prev_cgpa": 3.5,
    "study_hours": 6,
    "sleep_hours": 7
}

try:
    # Parse as PredictRequest
    request_data = PredictRequest(**test_data)
    print("✓ PredictRequest created successfully")
    
    # Call predict function
    response = predict_performance(request_data)
    print("✓ Prediction completed successfully!")
    print(f"\nResponse:")
    print(json.dumps(response.dict(), indent=2, default=str))
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
