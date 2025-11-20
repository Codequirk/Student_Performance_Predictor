import sys
sys.path.insert(0, r'c:\Users\pragn.LAPTOP-DAHFBVDA\OneDrive\Documents\student2.0\backend')

import os
import joblib
import pandas as pd
import numpy as np

# Load model and preprocessors
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = r'c:\Users\pragn.LAPTOP-DAHFBVDA\OneDrive\Documents\student2.0\backend'
model_dir = os.path.join(backend_dir, "model")

model_path = os.path.join(model_dir, "model.pkl")
scaler_path = os.path.join(model_dir, "scaler.pkl")
le_path = os.path.join(model_dir, "label_encoder.pkl")

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
le = joblib.load(le_path)

print(f"Model: {model}")
print(f"Model type: {type(model)}")
print(f"\nScaler: {scaler}")
print(f"Scaler feature count: {scaler.n_features_in_}")
print(f"Scaler mean shape: {scaler.mean_.shape}")
print(f"Scaler scale shape: {scaler.scale_.shape}")

print(f"\nLabel Encoder classes: {le.classes_}")

# Test with sample data
input_df = pd.DataFrame({
    'attendance': [85],
    'assignment_score': [85],
    'internal_marks': [42.5],
    'prev_cgpa': [3.5],
    'study_hours': [6],
    'sleep_hours': [7]
})

print(f"\n\nTest DataFrame shape: {input_df.shape}")
print(f"Test DataFrame columns: {list(input_df.columns)}")
print(f"Test DataFrame:\n{input_df}")

try:
    X_scaled = scaler.transform(input_df)
    print(f"\n✓ Scaled shape: {X_scaled.shape}")
    pred = model.predict(X_scaled)
    print(f"✓ Prediction: {pred}")
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()
