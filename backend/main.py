from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, courses, payments
import database # Will initialize DB tables on import

from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="GoGlish Academy Educational API",
    description="Backend API for secure student registration, course retrieval, RBAC lessons, and payment verification.",
    version="1.0.0"
)

# Ensure static/uploads exists
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure CORS for Next.js app (running at http://localhost:3000)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(payments.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to GoGlish Academy API. Documentation is available at /docs"}
