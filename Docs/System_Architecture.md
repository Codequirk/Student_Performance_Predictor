# System Architecture

## Overview
The system follows a modular, full-stack machine learning architecture with clear separation between frontend, backend, ML engine, and database.


## 1. Frontend Layer (Sravan)
- React + Tailwind CSS
- Input form for prediction
- Admin dashboard
- Charts (Radar, Bar)

## 2. Backend Layer (Ram)
- FastAPI server (Python)
- Endpoints:
  - `/predict`
  - `/model-info`
  - `/model-info/metrics`
- Loads the trained model `.pkl`
- Handles validation & response formatting
- Connects to MongoDB

## 3. Machine Learning Layer (Pragna)
- Python + scikit-learn + XGBoost
- Data preprocessing
- Model training
- Hyperparameter tuning
- Saves:
  - model.pkl  
  - scaler.pkl  
  - label_encoder.pkl  

## 4. Database Layer
- MongoDB Atlas  
- Collections:
  - `students`
  - `predictions`
- Stores prediction logs

