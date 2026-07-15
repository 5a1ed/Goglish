from pydantic import BaseModel, field_validator
from typing import Optional
import re
from models import UserRole

class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    grade: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        # Simple email regex to replace EmailStr dependency
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("بريد إلكتروني غير صالح")
        return v

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    teacher_id: int
    is_published: bool

    class Config:
        from_attributes = True

class LessonBase(BaseModel):
    title: str
    order: int
    is_free: bool
    main_points: Optional[str] = None
    questions: Optional[str] = None

class LessonCreate(LessonBase):
    content_url: str
    explanation: Optional[str] = None

class LessonResponse(LessonBase):
    id: int
    course_id: int
    content_url: Optional[str] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    course_id: int
    package_type: Optional[str] = "standard"
    payment_method: Optional[str] = "vodafone_cash"
    amount: Optional[float] = None

class CheckoutResponse(BaseModel):
    checkout_url: str
