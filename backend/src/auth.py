# auth.py
import os
import hmac
import hashlib
import json
import urllib.parse
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal  # Ensure your database.py defines SessionLocal and engine
from models import User         # Your User model defined in models.py
import jwt
import datetime
from database import get_db, upsert_user_from_telegram


load_dotenv()

router = APIRouter()

# Load BOT_TOKEN and TEST_MODE flag from .env
BOT_TOKEN = os.getenv("BOT_TOKEN", "8073824494:AAHQlUVQpvlzBFX_5kfjD02tcdRkjGTGBeI")
TEST_MODE = os.getenv("REACT_APP_TEST_MODE", "false").lower() == "true"

if TEST_MODE:
    print("[TEST MODE] Enabled. Test bypass for auth is active.")
else:
    print("[PRODUCTION MODE] Test bypass disabled. Full HMAC verification active.")

print("BOT_TOKEN:", BOT_TOKEN)

# … right after TEST_MODE …
JWT_SECRET          = os.getenv("JWT_SECRET", BOT_TOKEN)
JWT_ALGORITHM       = "HS256"
JWT_EXP_DELTA_HOURS = int(os.getenv("JWT_EXP_DELTA_HOURS", 168))  # default = 7 days

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_telegram_auth(init_data: str) -> dict:
    """
    Verify Telegram initData and return user info if valid; otherwise return {}.
    In TEST_MODE, if the hash equals "fakehash", bypass HMAC verification.
    """
    try:
        print("[DEBUG] Received init_data:", init_data)
        # Parse the initData string into key/value pairs
        parsed = dict(pair.split("=", 1) for pair in init_data.split("&") if "=" in pair)
        print("[DEBUG] Parsed data:", parsed)
        hash_value = parsed.pop("hash", None)
        print("[DEBUG] Extracted hash:", hash_value)
        if not hash_value:
            print("[DEBUG] No hash found in init_data.")
            return {}

        # If TEST_MODE is enabled and the hash is "fakehash", bypass HMAC verification.
        if TEST_MODE and hash_value == "fakehash":
            print("[DEBUG] TEST_MODE enabled and fakehash detected, bypassing HMAC check.")
            if "user" in parsed:
                user_json = urllib.parse.unquote(parsed["user"])
                print("[DEBUG] Decoded user JSON:", user_json)
                user_obj = json.loads(user_json)
                print("[DEBUG] Parsed user object:", user_obj)
                return user_obj
            return parsed

        # Build data_check_string by sorting keys alphabetically
        data_check_string = "\n".join(f"{k}={parsed[k]}" for k in sorted(parsed.keys()))
        print("[DEBUG] data_check_string:", data_check_string)

        # Calculate the secret key from BOT_TOKEN
        secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
        print("[DEBUG] Secret key (SHA256 of BOT_TOKEN):", secret_key)

        # Calculate HMAC using SHA256
        computed_hash = hmac.new(secret_key, msg=data_check_string.encode(), digestmod=hashlib.sha256).hexdigest()
        print("[DEBUG] Computed HMAC:", computed_hash)

        if computed_hash != hash_value:
            print("[DEBUG] HMAC verification failed.")
            return {}

        # Decode and parse the user information if present
        if "user" in parsed:
            user_json = urllib.parse.unquote(parsed["user"])
            print("[DEBUG] Decoded user JSON:", user_json)
            user_obj = json.loads(user_json)
            print("[DEBUG] Parsed user object:", user_obj)
            return user_obj

        print("[DEBUG] No user parameter found; returning parsed data.")
        return parsed
    except Exception as e:
        print(f"Error verifying Telegram auth data: {e}")
        return {}

@router.post("/auth/telegram")
async def auth_telegram(data: TelegramAuthSchema, db: Session = Depends(get_db)):
    verify_telegram_auth(data)  # ✅ Validate Telegram Mini App data

    user = db.query(User).filter_by(telegram_id=data.id).first()

    if user:
        user.last_login = datetime.utcnow()
        # Update photo if it was previously missing
        if not user.photo_url and data.photo_url:
            user.photo_url = data.photo_url
    else:
        user = User(
            telegram_id=data.id,
            username=data.username,
            photo_url=data.photo_url,
            last_login=datetime.utcnow()
        )
        db.add(user)

    db.commit()
    return {"status": "ok", "user_id": user.id}
