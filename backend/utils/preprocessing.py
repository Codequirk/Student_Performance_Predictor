"""
Preprocessing utilities for student performance prediction.
"""

def validate_input(data):
    """Validate input data."""
    errors = []
    
    if not (0 <= data.attendance <= 100):
        errors.append("Attendance must be between 0 and 100")
    
    if not (0 <= data.assignment_score <= 100):
        errors.append("Assignment score must be between 0 and 100")
    
    if not (0 <= data.internal_marks <= 50):
        errors.append("Internal marks must be between 0 and 50")
    
    if not (0 <= data.prev_cgpa <= 10):
        errors.append("Previous CGPA must be between 0 and 10")
    
    if not (0 <= data.study_hours <= 24):
        errors.append("Study hours must be between 0 and 24")
    
    if not (0 <= data.sleep_hours <= 24):
        errors.append("Sleep hours must be between 0 and 24")
    
    return errors

def normalize_score(score):
    """Normalize score to 0-100 range."""
    return max(0, min(100, score))
