"""Teacher Authentication Routes"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient
import os
from passlib.context import CryptContext
from utils.jwt_handler import create_access_token, decode_token
from datetime import timedelta, datetime, timezone

router = APIRouter(prefix="/teacher", tags=["Teacher"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TeacherRegister(BaseModel):
    email: EmailStr = Field(..., description="Teacher email")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")
    full_name: str = Field(..., description="Full name")
    school_name: str = Field(default="", description="School/Institution name")

class TeacherLogin(BaseModel):
    email: EmailStr = Field(..., description="Teacher email")
    password: str = Field(..., description="Password")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    teacher_email: str

def get_mongo_connection():
    """Get MongoDB connection"""
    try:
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        db = client["student_predictor"]
        return db
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return None

def hash_password(password: str):
    """Hash password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_current_teacher(authorization: str = Header(None)):
    """Get current teacher from token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return payload.get("email")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", response_model=TokenResponse, summary="Register new teacher")
def register_teacher(data: TeacherRegister):
    """Register a new teacher account"""
    try:
        db = get_mongo_connection()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        # Check if teacher already exists
        existing = db["teachers"].find_one({"email": data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Teacher with this email already exists")
        
        # Create teacher record
        teacher_record = {
            "email": data.email,
            "password_hash": hash_password(data.password),
            "full_name": data.full_name,
            "school_name": data.school_name,
            "created_at": datetime.now(timezone.utc),
            "is_active": True
        }
        
        result = db["teachers"].insert_one(teacher_record)
        
        # Create access token
        access_token = create_access_token(
            data={"email": data.email, "full_name": data.full_name},
            expires_delta=timedelta(hours=24)
        )
        
        return TokenResponse(
            access_token=access_token,
            teacher_email=data.email
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=TokenResponse, summary="Login teacher")
def login_teacher(data: TeacherLogin):
    """Login teacher with email and password"""
    db = get_mongo_connection()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Find teacher
    teacher = db["teachers"].find_one({"email": data.email})
    if not teacher:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(data.password, teacher["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(
        data={"email": data.email, "full_name": teacher.get("full_name", "")},
        expires_delta=timedelta(hours=24)
    )
    
    return TokenResponse(
        access_token=access_token,
        teacher_email=data.email
    )

@router.get("/me", summary="Get current teacher info")
def get_teacher_info(email: str = Depends(get_current_teacher)):
    """Get current logged-in teacher info"""
    db = get_mongo_connection()
    teacher = db["teachers"].find_one({"email": email})
    
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    return {
        "email": teacher["email"],
        "full_name": teacher.get("full_name", ""),
        "school_name": teacher.get("school_name", ""),
        "created_at": teacher.get("created_at")
    }
