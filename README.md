# Student Performance Predictor

A complete, production-ready full-stack system that predicts student academic performance using machine learning algorithms and provides a modern web-based interface for predictions and analytics.

## 🌟 Features

- **AI-Powered Predictions**: Uses Random Forest, Logistic Regression, SVM, and XGBoost models
- **Real-time Predictions**: Get instant performance predictions based on student data
- **Beautiful UI**: Modern React + Tailwind CSS interface with interactive visualizations
- **Admin Dashboard**: View model metrics, accuracy, precision, recall, and F1 scores
- **Data Visualization**: Radar charts and bar charts for probability distributions
- **RESTful API**: FastAPI backend with comprehensive Swagger documentation
- **MongoDB Integration**: Store student records and predictions in MongoDB Atlas
- **CORS Enabled**: Frontend and backend communication without restrictions
- **Comprehensive Logging**: Track all predictions and API requests

## 📊 Prediction Output

The system predicts:
1. **Numerical Score**: 0-100
2. **Performance Category**: Poor (0-50), Average (50-65), Good (65-80), Excellent (80-100)
3. **Probability Distribution**: Confidence scores for each category

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **ML Libraries**: scikit-learn, XGBoost
- **Database**: MongoDB
- **Documentation**: Swagger UI (FastAPI)

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Machine Learning
- **Python 3.10+**
- **Models**: Random Forest, Logistic Regression, SVM, XGBoost
- **Libraries**: scikit-learn, pandas, numpy
- **Hyperparameter Tuning**: GridSearchCV

## 📁 Project Structure

```
student-performance-predictor/
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (MongoDB URI)
│   ├── Dockerfile              # Docker configuration
│   ├── model/
│   │   ├── model.pkl           # Trained model (generated)
│   │   ├── scaler.pkl          # Feature scaler (generated)
│   │   └── label_encoder.pkl   # Label encoder (generated)
│   ├── routes/
│   │   ├── predict.py          # Prediction endpoint
│   │   ├── model_info.py       # Model info endpoint
│   │   └── train.py            # Training endpoint (demo)
│   ├── utils/
│   │   ├── logger.py           # Logging utility
│   │   └── preprocessing.py    # Data preprocessing
│   └── logs/                    # Application logs
│
├── frontend/
│   ├── public/
│   │   ├── index.html          # HTML entry point
│   │   └── manifest.json       # PWA manifest
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── index.js            # React root
│   │   ├── index.css           # Tailwind CSS
│   │   ├── components/
│   │   │   ├── PredictionForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── PerformanceRadar.jsx
│   │   │   ├── PerformanceBarChart.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Predict.jsx
│   │   │   └── Admin.jsx
│   │   └── services/
│   │       └── api.js          # API configuration
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── model/
│   ├── train_model.py          # ML training script
│   └── training.ipynb          # Jupyter notebook
│
├── database/
│   ├── schema.json             # MongoDB schema
│   └── sample_data.json        # Sample data
│
├── README.md                    # This file
├── SETUP.md                     # Setup instructions
├── API_DOCS.md                  # API documentation
└── postman_collection.json      # Postman API collection
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- MongoDB (Atlas recommended)
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env and add your MongoDB URI
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/student_performance

# Train the ML model (first time only)
cd ../model
python train_model.py
cd ../backend

# Run FastAPI server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for API URL (optional, defaults to localhost:8000)
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm start
```

Frontend will be available at: `http://localhost:3000`

## 📚 Input Features

The system requires the following student data:

| Feature | Range | Description |
|---------|-------|-------------|
| Attendance | 0-100 | Attendance percentage |
| Assignment Score | 0-100 | Average assignment score |
| Internal Marks | 0-50 | Internal examination marks |
| Previous CGPA | 0-10 | Previous semester CGPA (Indian 10-point scale) |
| Study Hours | 0-24 | Daily study hours |
| Sleep Hours | 0-24 | Daily sleep hours |

## 📈 Model Performance

**Best Model**: Random Forest Classifier (after hyperparameter tuning)

**Evaluation Metrics**:
- Accuracy: 89%
- Precision: 88%
- Recall: 87%
- F1-Score: 87%

**Model Training**:
- Training samples: 500
- Test samples: 100
- Hyperparameter tuning: GridSearchCV with 3-fold cross-validation

## 🔌 API Endpoints

### 1. Make Prediction
```
POST /predict
Content-Type: application/json

{
  "attendance": 85,
  "assignment_score": 78,
  "internal_marks": 45,
  "prev_cgpa": 8.2,
  "study_hours": 4.5,
  "sleep_hours": 7.0,
  "student_name": "John Doe",
  "roll_number": "20CS001"
}

Response:
{
  "predicted_score": 78.5,
  "predicted_category": "Good",
  "probabilities": {
    "Poor": 0.01,
    "Average": 0.08,
    "Good": 0.65,
    "Excellent": 0.26
  },
  "message": "Prediction successful..."
}
```

### 2. Get Model Info
```
GET /model-info

Response:
{
  "model_name": "Random Forest Classifier",
  "accuracy": 0.89,
  "features": [...],
  "labels": ["Poor", "Average", "Good", "Excellent"],
  "version": "1.0.0"
}
```

### 3. Get Model Metrics
```
GET /model-info/metrics

Response:
{
  "accuracy": 0.89,
  "precision": 0.88,
  "recall": 0.87,
  "f1_score": 0.87,
  "training_samples": 500,
  "test_samples": 100
}
```

## 🗄️ Database Schema (MongoDB)

### Collections

**students**
```json
{
  "name": "string",
  "roll_number": "string",
  "email": "string",
  "department": "string",
  "semester": "integer",
  "attendance": "float",
  "assignment_score": "float",
  "internal_marks": "float",
  "prev_cgpa": "float",
  "study_hours": "float",
  "sleep_hours": "float",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**predictions**
```json
{
  "student_name": "string",
  "roll_number": "string",
  "attendance": "float",
  "assignment_score": "float",
  "internal_marks": "float",
  "prev_cgpa": "float",
  "study_hours": "float",
  "sleep_hours": "float",
  "predicted_score": "float",
  "predicted_category": "string",
  "probabilities": "object",
  "created_at": "datetime"
}
```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build image
docker build -t student-predictor-backend:latest ./backend

# Run container
docker run -p 8000:8000 \
  -e MONGO_URI="mongodb+srv://..." \
  student-predictor-backend:latest
```

## ☁️ Cloud Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect Render/Railway to your GitHub repo
3. Set environment variable: `MONGO_URI`
4. Deploy with Dockerfile

### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to your GitHub repo
3. Set environment variable: `REACT_APP_API_URL` (your backend URL)
4. Vercel auto-deploys on push

### Database (MongoDB Atlas)
1. Create free cluster at mongodb.com/cloud/atlas
2. Create database user
3. Whitelist your IP addresses
4. Get connection string
5. Add to `MONGO_URI` environment variable

## 📝 Environment Variables

Create `.env` file in backend directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/student_performance?retryWrites=true&w=majority

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Logging
LOG_LEVEL=INFO
```

## 🧪 Testing

### Using Postman
1. Import `postman_collection.json` into Postman
2. Set base URL to `http://localhost:8000`
3. Test endpoints with provided sample requests

### Using cURL
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "attendance": 85,
    "assignment_score": 78,
    "internal_marks": 45,
    "prev_cgpa": 8.2,
    "study_hours": 4.5,
    "sleep_hours": 7.0
  }'
```

## 🔄 ML Model Training

To retrain the model with new data:

```bash
cd model
python train_model.py
```

This will:
1. Generate synthetic training data
2. Perform EDA and data preprocessing
3. Train multiple ML models
4. Perform hyperparameter tuning
5. Evaluate models
6. Save best model and preprocessors to `backend/model/`

## 📊 Performance Benchmarks

| Model | Accuracy |
|-------|----------|
| Logistic Regression | 82% |
| Random Forest | 89% |
| SVM | 85% |
| XGBoost | 87% |

**Selected**: Random Forest (highest accuracy after GridSearchCV tuning)

## 🚨 Error Handling

All endpoints include proper error handling with descriptive messages:

```json
{
  "detail": "Attendance must be between 0 and 100"
}
```

## 📚 API Documentation

Comprehensive Swagger documentation available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔐 Security Considerations

- All inputs validated on both frontend and backend
- CORS enabled for frontend communication
- Environment variables for sensitive data
- No hardcoded credentials
- Rate limiting recommendations for production

## 🐛 Troubleshooting

### Model not loading
- Ensure `train_model.py` has been run in `model/` directory
- Check `backend/model/` for `.pkl` files

### MongoDB connection fails
- Verify `MONGO_URI` in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### CORS errors
- Backend already has CORS enabled for all origins
- Check frontend API base URL in `api.js`

### Port already in use
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Student profile management
- [ ] Batch prediction upload (CSV)
- [ ] Model explainability (SHAP values)
- [ ] Real-time model updates
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Development Team

## 📞 Support

For issues and questions:
- GitHub Issues: [project repo]
- Email: support@studentpredictor.com

## 🎓 Educational Purpose

This project is designed for educational purposes to demonstrate:
- Full-stack web development
- Machine learning pipeline
- RESTful API design
- Modern frontend development
- Cloud deployment

---

**Last Updated**: November 18, 2025

**Version**: 1.0.0

Make sure to configure your MongoDB URI in the `.env` file before running the application!
