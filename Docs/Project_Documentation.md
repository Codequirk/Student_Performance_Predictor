# Student Performance Predictor – Full Project Documentation

## 1. Introduction
The Student Performance Predictor is a full-stack, machine-learning-powered system that predicts academic performance using multiple input features such as attendance, internal marks, CGPA, and study habits. The system provides accurate score predictions, performance categories, and probability distributions.

This project is collaboratively developed by:
- **Backend:** Ram  
- **Frontend:** Sravan  
- **Machine Learning:** Pragna

---

## 2. Problem Statement
Educational institutions often lack predictive tools that help them understand student performance trends early. This system solves this by providing:
- Instant predictions  
- Student analytics  
- Administrator insights  
- Data visualization  

---

## 3. Objectives
- Predict student score (0–100)
- Classify performance category (Poor, Average, Good, Excellent)
- Provide probability distribution
- Offer an interactive dashboard for users
- Store prediction logs in MongoDB

---

## 4. System Overview
The system has three major components:

### **1. Frontend (React + Tailwind CSS)**
- User-friendly interface
- Prediction form
- Charts and analytics
- Admin dashboard

### **2. Backend (FastAPI)**
- Provides machine learning prediction API
- Hosts model info & metrics endpoints
- Connects to MongoDB Atlas
- Includes CORS and logging

### **3. Machine Learning (Python + scikit-learn + XGBoost)**
- Handles data preprocessing
- Trains multiple models
- Performs hyperparameter tuning
- Saves final model as `.pkl` files

---

## 5. System Architecture
See: **System_Architecture.md**

---

## 6. Workflow
Model workflow and API workflow described in:
**Workflow_Diagram_Description.md**

---

## 7. Input Features
| Feature | Range | Description |
|---------|-------|-------------|
| Attendance | 0-100 | Percentage of classes attended |
| Assignment Score | 0-100 | Average assignment score |
| Internal Marks | 0-50 | Internal exam marks |
| Previous CGPA | 0-10 | Last semester CGPA |
| Study Hours | 0-24 | Daily study duration |
| Sleep Hours | 0-24 | Average sleep duration |

---

## 8. Machine Learning
- Models Used: Logistic Regression, SVM, Random Forest, XGBoost  
- Best Model: **Random Forest (89–94% accuracy)**  
- Tuning: **GridSearchCV**
- Stored in: `backend/model/`

---

## 9. API Endpoints
Details in: **API_Documentation.md**

---

## 10. Database Schema
Collections:  
- `students`  
- `predictions`

Schemas in `database/schema.json`.

---

## 11. Results & Evaluation
Attached: **Results_and_Evaluation.md**

---

## 12. Deployment
- Backend → Railway/Render  
- Frontend → Vercel  
- Database → MongoDB Atlas  

Instructions: **SETUP.md** & **DEPLOYMENT.md**

---

## 13. Conclusion
This project provides a complete, production-ready pipeline that helps institutions predict student performance accurately. It includes strong ML models, clean UI, and a robust backend.

