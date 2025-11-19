from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import predict, model_info, train
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Student Performance Predictor API",
    description="Predicts student performance and manages records.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(model_info.router)
app.include_router(train.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "Student Performance Predictor API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
