import time
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from database import get_db_connection
from schemas import UserCreate, UserResponse, Token, UserLogin
from auth import hash_password, verify_password, create_access_token, get_current_user
import sqlite3

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def register(user_in: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (user_in.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    hashed = hash_password(user_in.password)
    
    try:
        cursor.execute(
            "INSERT INTO users (name, email, hashed_password, phone, grade, role) VALUES (?, ?, ?, ?, ?, ?)",
            (user_in.name, user_in.email, hashed, user_in.phone, user_in.grade, "student")
        )
        user_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT id, name, email, phone, grade, role FROM users WHERE id = ?", (user_id,))
        new_user = cursor.fetchone()
        conn.close()
        return dict(new_user)
    except sqlite3.Error as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login(login_in: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, hashed_password, role FROM users WHERE email = ?", (login_in.email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(login_in.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
