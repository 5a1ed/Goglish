import secrets
from fastapi import APIRouter, Depends, HTTPException, status, Request
from database import get_db_connection
from schemas import CheckoutRequest, CheckoutResponse
from auth import get_current_user
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("/checkout", response_model=CheckoutResponse)
def create_checkout(req: CheckoutRequest, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify course exists
    cursor.execute("SELECT id, title, price FROM courses WHERE id = ?", (req.course_id,))
    course = cursor.fetchone()
    if not course:
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
        
    # Calculate amount based on package if not provided
    amount = req.amount
    if amount is None:
        price = course["price"]
        if req.package_type == "lite":
            amount = price
        elif req.package_type == "standard":
            amount = price * 2.2
        elif req.package_type == "platinum":
            amount = price * 4.0
        else:
            amount = price

    # Generate mock Stripe/Vodafone Cash session ID
    session_id = f"cs_mock_{secrets.token_hex(16)}"
    
    # Save pending transaction with package info
    cursor.execute(
        "INSERT INTO payment_transactions (user_id, course_id, provider, provider_session_id, amount, currency, status, package_type, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (current_user["id"], req.course_id, "mock_stripe", session_id, amount, "EGP", "pending", req.package_type, req.payment_method)
    )
    conn.commit()
    conn.close()
    
    # Redirect to success dashboard page
    checkout_url = f"http://localhost:3000/dashboard/payments/success?session_id={session_id}"
    return {"checkout_url": checkout_url}

@router.post("/webhook")
async def payment_webhook(request: Request):
    try:
        body = await request.json()
        session_id = body.get("session_id")
        if not session_id:
            raise HTTPException(status_code=400, detail="Missing session_id")
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Fetch pending transaction with package details
        cursor.execute("SELECT user_id, course_id, status, package_type FROM payment_transactions WHERE provider_session_id = ?", (session_id,))
        tx = cursor.fetchone()
        if not tx:
            conn.close()
            raise HTTPException(status_code=404, detail="Transaction session not found")
            
        if tx["status"] == "pending":
            # 2. Complete transaction
            cursor.execute("UPDATE payment_transactions SET status = 'completed' WHERE provider_session_id = ?", (session_id,))
            
            # Calculate expiration offsets
            now = datetime.utcnow()
            package_type = tx["package_type"] or "standard"
            if package_type == "lite":
                expires_at = now + timedelta(days=30)
            elif package_type == "standard":
                expires_at = now + timedelta(days=90)
            elif package_type == "platinum":
                expires_at = now + timedelta(days=180)
            else:
                expires_at = now + timedelta(days=90)
            expires_at_str = expires_at.strftime("%Y-%m-%d %H:%M:%S")

            # 3. Grant course access
            cursor.execute(
                "INSERT INTO enrollments (user_id, course_id, status, expires_at) VALUES (?, ?, ?, ?)",
                (tx["user_id"], tx["course_id"], "active", expires_at_str)
            )
            conn.commit()
            
        conn.close()
        return {"status": "success", "message": "Enrollment activated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{session_id}")
def check_payment_status(session_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT status, course_id, amount, package_type, created_at FROM payment_transactions WHERE provider_session_id = ? AND user_id = ?", (session_id, current_user["id"]))
    tx = cursor.fetchone()
    conn.close()
    
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Parse created_at or use current time
    try:
        # SQLite created_at defaults to CURRENT_TIMESTAMP, format is YYYY-MM-DD HH:MM:SS
        created_at = datetime.strptime(tx["created_at"], "%Y-%m-%d %H:%M:%S")
    except Exception:
        created_at = datetime.utcnow()
        
    package_type = tx["package_type"] or "standard"
    if package_type == "lite":
        duration = 1
        end_date = created_at + timedelta(days=30)
    elif package_type == "standard":
        duration = 3
        end_date = created_at + timedelta(days=90)
    elif package_type == "platinum":
        duration = 6
        end_date = created_at + timedelta(days=180)
    else:
        duration = 3
        end_date = created_at + timedelta(days=90)
        
    start_date_str = created_at.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
        
    return {
        "status": tx["status"],
        "course_id": tx["course_id"],
        "amount": tx["amount"],
        "package_type": package_type,
        "start_date": start_date_str,
        "end_date": end_date_str,
        "duration_months": duration
    }
