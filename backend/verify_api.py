import os
os.environ['NO_PROXY'] = 'localhost,127.0.0.1'
import urllib.request
import json
import sys

def post_json(url, data, headers=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json', **headers},
        method='POST'
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode('utf-8'))

def get_json(url, headers=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(
        url,
        headers=headers,
        method='GET'
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode('utf-8'))

try:
    print("1. Registering user...")
    try:
        user = post_json("http://127.0.0.1:8000/api/auth/register", {
            "name": "Test Student",
            "email": "test@goglish.app",
            "phone": "01000000000",
            "grade": "ثانية ثانوي",
            "password": "password123"
        })
        print("User registered:", user)
    except Exception as e:
        print("Registration warning (User might already exist):", e)

    print("\n2. Logging in...")
    token = post_json("http://127.0.0.1:8000/api/auth/login", {
        "email": "test@goglish.app",
        "password": "password123"
    })
    print("Token response:", token)
    auth_header = {"Authorization": f"Bearer {token['access_token']}"}

    print("\n3. Getting user details...")
    me = get_json("http://127.0.0.1:8000/api/auth/me", auth_header)
    print("Current user:", me)

    print("\n4. Listing courses...")
    courses = get_json("http://127.0.0.1:8000/api/courses")
    print("Courses count:", len(courses))
    for c in courses:
        print(f"Course: {c['title']} - Price: {c['price']} EGP")

    if courses:
        course_id = courses[0]['id']
        print(f"\n5. Getting lessons for Course {course_id} before buying...")
        lessons = get_json(f"http://127.0.0.1:8000/api/courses/{course_id}/lessons", auth_header)
        for l in lessons:
            print(f"Lesson: {l['title']} - Unlocked: {l['content_url'] is not None}")

        print(f"\n6. Requesting checkout for Course {course_id}...")
        checkout = post_json("http://127.0.0.1:8000/api/payments/checkout", {
            "course_id": course_id
        }, auth_header)
        print("Checkout response:", checkout)
        
        session_id = checkout['checkout_url'].split("session_id=")[1]
        print(f"Mock Session ID: {session_id}")

        print(f"\n7. Simulating webhook callback...")
        webhook = post_json("http://127.0.0.1:8000/api/payments/webhook", {
            "session_id": session_id
        })
        print("Webhook response:", webhook)

        print(f"\n8. Checking payment status...")
        status_res = get_json(f"http://127.0.0.1:8000/api/payments/status/{session_id}", auth_header)
        print("Status response:", status_res)

        print(f"\n9. Getting lessons for Course {course_id} after buying...")
        lessons_after = get_json(f"http://127.0.0.1:8000/api/courses/{course_id}/lessons", auth_header)
        for l in lessons_after:
            print(f"Lesson: {l['title']} - Unlocked: {l['content_url'] is not None}")
            if l['title'] == "الدرس الثاني: الحركة الموجية (مدفوع)" and l['content_url'] is None:
                print("Error: Premium lesson still locked after payment!")
                sys.exit(1)

    print("\nAll integration checks passed successfully!")
    sys.exit(0)
except Exception as e:
    print("Verification failed:", e)
    sys.exit(1)
