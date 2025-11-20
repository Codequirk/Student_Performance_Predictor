# Workflow Description

## 1. Prediction Workflow
1. User enters input in frontend form  
2. Axios sends POST request to `/predict`  
3. FastAPI validates input  
4. ML model transforms & predicts  
5. Backend stores data in MongoDB  
6. Response sent back to frontend  
7. Frontend shows:
   - score
   - category
   - charts

---

## 2. Training Workflow
1. Load dataset or synthetic data  
2. Preprocess (scaling, encoding)  
3. Train 4 models  
4. Apply GridSearchCV  
5. Evaluate & compare metrics  
6. Save best model  

---

## 3. Database Workflow
1. Backend connects using `MONGO_URI`  
2. On prediction:
   - student info stored
   - prediction stored  
3. Admin dashboard reads past predictions

