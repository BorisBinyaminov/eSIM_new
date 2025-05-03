import os
import hmac
import hashlib
import json
import urllib.parse
import logging
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal, upsert_user_from_telegram
from datetime import datetime
from models import User                   # unchanged
load_dotenv()

router = APIRouter()
BOT_TOKEN = os.getenv("BOT_TOKEN")
TEST_MODE = os.getenv("REACT_APP_TEST_MODE", "false").lower() == "true"

logging.basicConfig(level=logging.ERROR)
logging.debug(f"[AUTH] TEST_MODE={TEST_MODE}, BOT_TOKEN set={bool(BOT_TOKEN)}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_telegram_auth(init_data: str) -> dict:
    """
    Returns parsed user object on success, or {} on failure.
    In TEST_MODE, accepts hash=="fakehash" as bypass.
    """
    try:
        # parse k=v pairs
        parsed = dict(pair.split("=",1) for pair in init_data.split("&") if "=" in pair)
        received_hash = parsed.pop("hash", None)
        logging.debug(f"[AUTH] parsed initData, hash={received_hash}")

        if not received_hash:
            return {}

        # TEST_MODE bypass
        if TEST_MODE and received_hash == "fakehash":
            user_json = urllib.parse.unquote(parsed.get("user",""))
            return json.loads(user_json)

        # build data_check_string
        data_check = "\n".join(f"{k}={parsed[k]}" for k in sorted(parsed.keys()))
        secret = hashlib.sha256(BOT_TOKEN.encode()).digest()
        computed = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()

        if computed != received_hash:
            logging.warning("[AUTH] HMAC mismatch")
            return {}

        # extract user
        if "user" in parsed:
            return json.loads(urllib.parse.unquote(parsed["user"]))
        return {}

    except Exception as e:
        logging.exception("Error in verify_telegram_auth")
        return {}

@router.post("/auth/telegram")
async def telegram_auth(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    init_data = body.get("initData", "")
    if not init_data:
        return JSONResponse({"success": False, "error": "No initData provided"}, status_code=400)

    user_info = verify_telegram_auth(init_data)
    if not user_info:
        return JSONResponse({"success": False, "error": "Invalid auth data"}, status_code=403)

    telegram_id = str(user_info["id"])
    username   = user_info.get("username") or user_info.get("first_name", "Telegram User")
    photo_url  = user_info.get("photo_url") or "/images/default_avatar.png"

    # upsert and ALWAYS update last_login
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if user:
        user.username    = username
        user.photo_url   = photo_url
        user.last_login  = datetime.utcnow()
    else:
        user = User(
            telegram_id=telegram_id,
            username=username,
            photo_url=photo_url,
            last_login=datetime.utcnow()
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "user": {
            "id": user.id,
            "telegram_id": user.telegram_id,
            "username": user.username,
            "photo_url": user.photo_url,
            "last_login": user.last_login.isoformat()  # for debug
        }
    }