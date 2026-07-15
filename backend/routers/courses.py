from fastapi import APIRouter, Depends, HTTPException, status, Request
from database import get_db_connection
from schemas import CourseResponse, LessonResponse, CourseCreate, LessonCreate
from auth import get_current_user, RoleChecker
from typing import List
import os
import secrets
import shutil
import time
import re

router = APIRouter(prefix="/api/courses", tags=["Courses & Lessons"])

@router.get("", response_model=List[CourseResponse])
def get_courses():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, price, teacher_id, is_published FROM courses WHERE is_published = 1")
    courses = cursor.fetchall()
    conn.close()
    return [dict(c) for c in courses]

@router.get("/{course_id}/lessons", response_model=List[LessonResponse])
def get_lessons(course_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Fetch course details
    cursor.execute("SELECT id, price, teacher_id FROM courses WHERE id = ?", (course_id,))
    course = cursor.fetchone()
    if not course:
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
        
    # 2. Check enrollment or ownership
    is_authorized = False
    if current_user.get("role") in ["admin", "teacher"] or course["price"] == 0.0:
        is_authorized = True
    else:
        # Check if student is enrolled in active status
        cursor.execute(
            "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'",
            (current_user["id"], course_id)
        )
        if cursor.fetchone():
            is_authorized = True
            
    # 3. Get lessons
    cursor.execute('SELECT id, course_id, title, content_url, "order", is_free, main_points, questions, explanation FROM lessons WHERE course_id = ? ORDER BY "order" ASC', (course_id,))
    lessons = cursor.fetchall()
    conn.close()
    
    result = []
    for lesson in lessons:
        lesson_dict = dict(lesson)
        # Redact content_url and explanation if user is not authorized and lesson is not free
        if not is_authorized and not lesson_dict["is_free"]:
            lesson_dict["content_url"] = None
            lesson_dict["explanation"] = None
        result.append(lesson_dict)
        
    return result

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(course_in: CourseCreate, current_user: dict = Depends(RoleChecker(["admin", "teacher"]))):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO courses (title, description, price, teacher_id, is_published) VALUES (?, ?, ?, ?, ?)",
            (course_in.title, course_in.description, course_in.price, current_user["id"], 1)
        )
        course_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT id, title, description, price, teacher_id, is_published FROM courses WHERE id = ?", (course_id,))
        course = cursor.fetchone()
        conn.close()
        return dict(course)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{course_id}/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def create_lesson(course_id: int, lesson_in: LessonCreate, current_user: dict = Depends(RoleChecker(["admin", "teacher"]))):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if course exists
    cursor.execute("SELECT id FROM courses WHERE id = ?", (course_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
        
    try:
        cursor.execute(
            "INSERT INTO lessons (course_id, title, content_url, \"order\", is_free, main_points, questions, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (course_id, lesson_in.title, lesson_in.content_url, lesson_in.order, 1 if lesson_in.is_free else 0, lesson_in.main_points, lesson_in.questions, lesson_in.explanation)
        )
        lesson_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT id, course_id, title, content_url, \"order\", is_free, main_points, questions, explanation FROM lessons WHERE id = ?", (lesson_id,))
        lesson = cursor.fetchone()
        conn.close()
        return dict(lesson)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-video", status_code=status.HTTP_200_OK)
async def upload_video(request: Request, current_user: dict = Depends(RoleChecker(["admin", "teacher"]))):
    try:
        content_type = request.headers.get("content-type", "")
        match = re.search(r"boundary=(.*)", content_type)
        if not match:
            raise HTTPException(status_code=400, detail="Invalid content type, boundary not found")
        boundary = match.group(1).encode("utf-8")
        
        body = await request.body()
        parts = body.split(boundary)
        
        file_data = None
        filename = "uploaded_video.mp4"
        
        for part in parts:
            if b"Content-Disposition" in part and b"filename=" in part:
                # Find the filename
                fn_match = re.search(rb'filename="([^"]+)"', part)
                if fn_match:
                    filename = fn_match.group(1).decode("utf-8", errors="ignore")
                
                # Split headers from body in this part
                header_end = part.find(b"\r\n\r\n")
                if header_end != -1:
                    file_data = part[header_end + 4:]
                    # Strip trailing boundary delimiters
                    if file_data.endswith(b"\r\n--"):
                        file_data = file_data[:-4]
                    elif file_data.endswith(b"\r\n"):
                        file_data = file_data[:-2]
                    break
        
        if not file_data:
            raise HTTPException(status_code=400, detail="No video file found in the request")
            
        ext = os.path.splitext(filename)[1]
        new_filename = f"{int(time.time())}_{secrets.token_hex(8)}{ext}"
        
        os.makedirs("static/uploads", exist_ok=True)
        file_path = os.path.join("static/uploads", new_filename)
        
        with open(file_path, "wb") as f:
            f.write(file_data)
            
        return {"video_url": f"http://127.0.0.1:8000/static/uploads/{new_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video file: {str(e)}")

@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_200_OK)
def delete_lesson(lesson_id: int, current_user: dict = Depends(RoleChecker(["admin", "teacher"]))):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if lesson exists
    cursor.execute("SELECT id, content_url FROM lessons WHERE id = ?", (lesson_id,))
    lesson = cursor.fetchone()
    if not lesson:
        conn.close()
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    try:
        # Delete local uploaded file if it exists
        content_url = lesson["content_url"]
        if content_url and "/static/uploads/" in content_url:
            filename = content_url.split("/static/uploads/")[1]
            file_path = os.path.join("static/uploads", filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                
        cursor.execute("DELETE FROM lessons WHERE id = ?", (lesson_id,))
        conn.commit()
        conn.close()
        return {"message": "Lesson deleted successfully"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
