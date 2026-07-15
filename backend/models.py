from enum import Enum as PyEnum

class UserRole(str, PyEnum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class EnrollmentStatus(str, PyEnum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    EXPIRED = "expired"

class TransactionStatus(str, PyEnum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
