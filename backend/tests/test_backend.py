import unittest
import os
import time

# Ensure we use a test database
os.environ["DB_FILE"] = "test_edu_platform.db"

# Add parent directory to sys.path so we can import backend modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import init_db, get_db_connection
from auth import hash_password, verify_password, jwt_encode, jwt_decode, create_access_token
from schemas import UserCreate, UserLogin, CheckoutRequest, CourseCreate, LessonCreate
from routers.auth import register, login
from routers.courses import get_courses, get_lessons, create_course, create_lesson, delete_lesson
from routers.payments import create_checkout, check_payment_status, payment_webhook
from fastapi import HTTPException
from unittest.mock import Mock

class TestEducationalPlatform(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Initialize test database
        if os.path.exists("test_edu_platform.db"):
            os.remove("test_edu_platform.db")
        init_db()
        
    @classmethod
    def tearDownClass(cls):
        # Clean up test database
        if os.path.exists("test_edu_platform.db"):
            try:
                os.remove("test_edu_platform.db")
            except Exception:
                pass

    def test_01_password_hashing(self):
        password = "my_secret_password"
        hashed = hash_password(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrong_password", hashed))

    def test_02_jwt_token_flow(self):
        payload = {"sub": "student@goglish.app", "role": "student"}
        token = create_access_token(payload)
        decoded = jwt_decode(token)
        self.assertEqual(decoded["sub"], "student@goglish.app")
        
        # Test expiration
        expired_payload = {"sub": "expired@goglish.app", "exp": time.time() - 10}
        expired_token = jwt_encode(expired_payload)
        with self.assertRaises(ValueError):
            jwt_decode(expired_token)

    def test_03_auth_endpoints(self):
        # Test Registration
        user_in = UserCreate(
            name="Test User",
            email="test_user@goglish.app",
            phone="01012345678",
            grade="ثانية ثانوي",
            password="password123"
        )
        res = register(user_in)
        self.assertEqual(res["name"], "Test User")
        self.assertEqual(res["email"], "test_user@goglish.app")
        
        # Test duplicate registration
        with self.assertRaises(HTTPException) as ctx:
            register(user_in)
        self.assertEqual(ctx.exception.status_code, 400)
        
        # Test Login
        login_in = UserLogin(email="test_user@goglish.app", password="password123")
        token_res = login(login_in)
        self.assertEqual(token_res["token_type"], "bearer")
        self.assertTrue(len(token_res["access_token"]) > 0)
        
        # Test Login failure
        bad_login_in = UserLogin(email="test_user@goglish.app", password="wrongpassword")
        with self.assertRaises(HTTPException) as ctx:
            login(bad_login_in)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_04_courses_and_lessons_rbac(self):
        # Fetch courses
        courses = get_courses()
        self.assertTrue(len(courses) > 0)
        
        # Get a course that has seeded lessons
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT course_id FROM lessons LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(row, "No lessons found in database for testing!")
        course_id = row["course_id"]
        
        # Mock student user
        student_user = {"id": 2, "name": "Test User", "email": "test_user@goglish.app", "phone": "01012345678", "grade": "ثانية ثانوي", "role": "student"}
        
        # Get lessons before purchasing (premium lesson should be locked)
        lessons = get_lessons(course_id, current_user=student_user)
        self.assertTrue(len(lessons) > 0)
        
        free_lesson = next(l for l in lessons if l["is_free"])
        premium_lesson = next(l for l in lessons if not l["is_free"])
        
        self.assertIsNotNone(free_lesson["content_url"])
        self.assertIsNone(premium_lesson["content_url"])  # Locked

    async def run_checkout_and_webhook_enrollment(self):
        # Get a course that has seeded lessons
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT course_id FROM lessons LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(row, "No lessons found in database for testing!")
        course_id = row["course_id"]
        student_user = {"id": 2, "name": "Test User", "email": "test_user@goglish.app", "phone": "01012345678", "grade": "ثانية ثانوي", "role": "student"}
        
        # 1. Create Checkout
        req = CheckoutRequest(
            course_id=course_id,
            package_type="platinum",
            payment_method="vodafone_cash",
            amount=300.0
        )
        checkout_res = create_checkout(req, current_user=student_user)
        self.assertTrue("checkout_url" in checkout_res)
        
        session_id = checkout_res["checkout_url"].split("session_id=")[1]
        
        # 2. Check Status (should be pending)
        status_res = check_payment_status(session_id, current_user=student_user)
        self.assertEqual(status_res["status"], "pending")
        self.assertEqual(status_res["package_type"], "platinum")
        self.assertEqual(status_res["amount"], 300.0)
        self.assertEqual(status_res["duration_months"], 6)
        self.assertIsNotNone(status_res["start_date"])
        self.assertIsNotNone(status_res["end_date"])
        
        # 3. Simulate Webhook
        mock_req = Mock()
        async def mock_json():
            return {"session_id": session_id}
        mock_req.json = mock_json
        
        await payment_webhook(mock_req)
        
        # 4. Check Status again (should be completed)
        status_res_after = check_payment_status(session_id, current_user=student_user)
        self.assertEqual(status_res_after["status"], "completed")
        
        # 5. Verify premium lesson is now unlocked
        lessons = get_lessons(course_id, current_user=student_user)
        premium_lesson = next(l for l in lessons if not l["is_free"])
        self.assertIsNotNone(premium_lesson["content_url"])  # Unlocked!

    def test_05_async_wrapper(self):
        import asyncio
        asyncio.run(self.run_checkout_and_webhook_enrollment())

    def test_06_admin_creation_endpoints(self):
        # 1. Create a course as an admin/teacher
        teacher_user = {"id": 1, "name": "Teacher User", "email": "teacher@goglish.app", "phone": "01000000001", "role": "teacher"}
        
        course_in = CourseCreate(
            title="اللغة العربية - اختبار",
            description="وصف مادة اللغة العربية التجريبية",
            price=90.0
        )
        
        new_course = create_course(course_in, current_user=teacher_user)
        self.assertEqual(new_course["title"], "اللغة العربية - اختبار")
        self.assertEqual(new_course["price"], 90.0)
        
        # 2. Add a lesson to this course
        lesson_in = LessonCreate(
            title="الدرس الأول في اللغة العربية",
            content_url="https://www.youtube.com/embed/arabic1",
            order=1,
            is_free=True,
            main_points="نقاط رئيسية",
            questions="سؤال اختبار",
            explanation="إجابة تفصيلية"
        )
        
        new_lesson = create_lesson(new_course["id"], lesson_in, current_user=teacher_user)
        self.assertEqual(new_lesson["title"], "الدرس الأول في اللغة العربية")
        self.assertEqual(new_lesson["content_url"], "https://www.youtube.com/embed/arabic1")
        self.assertTrue(new_lesson["is_free"])
        self.assertEqual(new_lesson["main_points"], "نقاط رئيسية")
        self.assertEqual(new_lesson["questions"], "سؤال اختبار")
        self.assertEqual(new_lesson["explanation"], "إجابة تفصيلية")

        # 3. Delete the lesson
        del_res = delete_lesson(new_lesson["id"], current_user=teacher_user)
        self.assertEqual(del_res["message"], "Lesson deleted successfully")
        
        # Verify it is no longer returned
        lessons_after = get_lessons(new_course["id"], current_user=teacher_user)
        self.assertFalse(any(l["id"] == new_lesson["id"] for l in lessons_after))

    def test_07_video_upload_custom_multipart(self):
        teacher_user = {"id": 1, "name": "Teacher User", "email": "teacher@goglish.app", "phone": "01000000001", "role": "teacher"}
        
        # Mock multipart payload
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="test_video.mp4"\r\n'
            f"Content-Type: video/mp4\r\n\r\n"
            f"MOCK_MP4_BINARY_DATA_12345\r\n"
            f"--{boundary}--\r\n"
        ).encode("utf-8")
        
        mock_req = Mock()
        mock_req.headers = {"content-type": f"multipart/form-data; boundary={boundary}"}
        async def mock_body():
            return body
        mock_req.body = mock_body
        
        import asyncio
        from routers.courses import upload_video
        
        async def run_upload():
            return await upload_video(mock_req, current_user=teacher_user)
            
        res = asyncio.run(run_upload())
        self.assertTrue("video_url" in res)
        self.assertTrue(res["video_url"].startswith("http://127.0.0.1:8000/static/uploads/"))
        
        # Verify saved file contents
        filename = res["video_url"].split("/static/uploads/")[1]
        file_path = os.path.join("static/uploads", filename)
        self.assertTrue(os.path.exists(file_path))
        
        with open(file_path, "r") as f:
            content = f.read()
        self.assertEqual(content, "MOCK_MP4_BINARY_DATA_12345")
        
        # Clean up test file
        os.remove(file_path)

if __name__ == "__main__":
    unittest.main()
