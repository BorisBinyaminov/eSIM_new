import os
import hmac
import hashlib
import json
import urllib.parse
import logging
from fastapi import APIRouter, HTTPException, Body
from dotenv import load_dotenv
from database import SessionLocal, upsert_user
from fastapi import APIRouter, HTTPException
from database import SessionLocal, upsert_user

load_dotenv()

router = APIRouter()
BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")
if not BOT_TOKEN:
    raise ValueError("❌ TELEGRAM_TOKEN is not set in environment variables")
TEST_MODE = os.getenv("REACT_APP_TEST_MODE", "false").lower() == "true"

logging.basicConfig(level=logging.DEBUG)
logging.debug(f"[AUTH] TEST_MODE={TEST_MODE}, TELEGRAM_TOKEN is={BOT_TOKEN}")

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
    print(f"[AUTH DEBUG] BOT_TOKEN in verify_telegram_auth: {BOT_TOKEN!r}")

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
async def auth_telegram(payload: dict = Body(...)):
    logging.debug(f"🔥 Received auth payload: {payload}")
    try:
        verified_user = verify_telegram_auth(payload.get("initData"))
        logging.debug(f"✅ Verified user: {verified_user}")
    except Exception as e:
        logging.error("❌ Telegram authentication failed", exc_info=True)
        raise HTTPException(status_code=403, detail="Telegram authentication failed")

    db = SessionLocal()
    try:
        upsert_user(db, {
            "id": verified_user["id"],
            "username": verified_user.get("username"),
            "first_name": verified_user.get("first_name"),
            "last_name": verified_user.get("last_name"),
            "photo_url": verified_user.get("photo_url"),
        })
        logging.debug("✅ upsert_user() executed successfully")
    finally:
        db.close()

    return {"success": True, "user": verified_user}

