#!/usr/bin/env python
"""Test teacher registration"""
import sys
sys.path.insert(0, '/c/Users/pragn.LAPTOP-DAHFBVDA/OneDrive/Documents/student2.0/backend')

# Load environment variables FIRST
from dotenv import load_dotenv
load_dotenv()

from routes.teacher import register_teacher, TeacherRegister
import traceback

try:
    data = TeacherRegister(
        email="test@school.com",
        password="test123",
        full_name="Test Teacher",
        school_name="Test School"
    )
    print(f"[OK] Created request: {data}")
    
    result = register_teacher(data)
    print(f"[OK] Registration successful: {result}")
except Exception as e:
    print(f"[ERROR] {e}")
    traceback.print_exc()
