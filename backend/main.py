from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import predict, model_info, train, teacher, teacher_upload
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Student Performance Predictor API",
    description="Predicts student performance and manages records.",
    version="1.2.0"
)

# Add CORS middleware with explicit configuration for file downloads
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Type", "*"],
    max_age=3600,
)

app.include_router(predict.router)
app.include_router(model_info.router)
app.include_router(train.router)
app.include_router(teacher.router)
app.include_router(teacher_upload.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "Student Performance Predictor API is running!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
