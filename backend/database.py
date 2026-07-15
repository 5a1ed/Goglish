import sqlite3
import os

DB_FILE = os.getenv("DB_FILE", "edu_platform.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        phone TEXT NOT NULL,
        grade TEXT,
        role TEXT NOT NULL DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Courses table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL DEFAULT 0.0,
        teacher_id INTEGER,
        is_published BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users (id)
    )
    """)
    
    # Lessons table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content_url TEXT,
        "order" INTEGER DEFAULT 0,
        is_free BOOLEAN DEFAULT 0,
        main_points TEXT,
        questions TEXT,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id)
    )
    """)
    
    # Database migration checks
    cursor.execute("PRAGMA table_info(lessons)")
    columns = [col[1] for col in cursor.fetchall()]
    if "main_points" not in columns:
        cursor.execute("ALTER TABLE lessons ADD COLUMN main_points TEXT")
    if "questions" not in columns:
        cursor.execute("ALTER TABLE lessons ADD COLUMN questions TEXT")
    if "explanation" not in columns:
        cursor.execute("ALTER TABLE lessons ADD COLUMN explanation TEXT")
    
    # Enrollments table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (course_id) REFERENCES courses (id)
    )
    """)
    
    # Run migrations for enrollments expires_at column
    cursor.execute("PRAGMA table_info(enrollments)")
    en_cols = [col[1] for col in cursor.fetchall()]
    if "expires_at" not in en_cols:
        cursor.execute("ALTER TABLE enrollments ADD COLUMN expires_at TIMESTAMP")
    
    # Payment transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payment_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        provider TEXT NOT NULL,
        provider_session_id TEXT UNIQUE NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'EGP',
        status TEXT NOT NULL DEFAULT 'pending',
        package_type TEXT,
        payment_method TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (course_id) REFERENCES courses (id)
    )
    """)

    # Run migrations for payment_transactions columns
    cursor.execute("PRAGMA table_info(payment_transactions)")
    tx_cols = [col[1] for col in cursor.fetchall()]
    if "package_type" not in tx_cols:
        cursor.execute("ALTER TABLE payment_transactions ADD COLUMN package_type TEXT")
    if "payment_method" not in tx_cols:
        cursor.execute("ALTER TABLE payment_transactions ADD COLUMN payment_method TEXT")
    
    # Seed default admin if empty
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'")
    if cursor.fetchone()[0] == 0:
        from auth import hash_password
        admin_pw = hash_password("admin123")
        cursor.execute(
            "INSERT INTO users (name, email, hashed_password, phone, grade, role) VALUES (?, ?, ?, ?, ?, ?)",
            ("المدير العام", "admin@goglish.app", admin_pw, "01000000000", "عام", "admin")
        )

    # Seed courses if empty
    cursor.execute("SELECT COUNT(*) FROM courses")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO courses (title, description, price, teacher_id, is_published) VALUES (?, ?, ?, ?, ?)",
                       ("الرياضيات - الصف الثاني الثانوي", "شرح مادة الرياضيات بالكامل للترم الأول", 150.0, 1, 1))
        cursor.execute("INSERT INTO courses (title, description, price, teacher_id, is_published) VALUES (?, ?, ?, ?, ?)",
                       ("الفيزياء - الصف الثاني الثانوي", "شرح كامل وتدريبات تفاعلية في مادة الفيزياء", 120.0, 1, 1))
        course_id = cursor.lastrowid
        # Seed a free and premium lesson
        cursor.execute("INSERT INTO lessons (course_id, title, content_url, 'order', is_free) VALUES (?, ?, ?, ?, ?)",
                       (course_id, "الدرس الأول: الحركة الاهتزازية (مجاني)", "https://www.youtube.com/embed/dQw4w9WgXcQ", 1, 1))
        cursor.execute("INSERT INTO lessons (course_id, title, content_url, 'order', is_free) VALUES (?, ?, ?, ?, ?)",
                       (course_id, "الدرس الثاني: الحركة الموجية (مدفوع)", "https://www.youtube.com/embed/dQw4w9WgXcQ", 2, 0))

        # Seed additional courses
        cursor.execute("INSERT INTO courses (title, description, price, teacher_id, is_published) VALUES (?, ?, ?, ?, ?)",
                       ("اللغة العربية - الصف الثاني الثانوي", "شرح قواعد النحو والصرف والبلاغة المنهج كامل", 100.0, 1, 1))
        cursor.execute("INSERT INTO courses (title, description, price, teacher_id, is_published) VALUES (?, ?, ?, ?, ?)",
                       ("الكيمياء - الصف الثاني الثانوي", "شرح الجدول الدوري وقواعد التفاعلات الكيميائية بالكامل", 130.0, 1, 1))
        cursor.execute("INSERT INTO courses (title, description, price, teacher_id, is_published) VALUES (?, ?, ?, ?, ?)",
                       ("اللغة الإنجليزية - الصف الثاني الثانوي", "تغطية كاملة للقواعد والكلمات وقصة المنهج بالتفصيل", 110.0, 1, 1))

    conn.commit()
    conn.close()

# Initialize database on import
init_db()
