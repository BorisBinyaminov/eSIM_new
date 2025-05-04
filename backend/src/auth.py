import os
import logging
import hmac
import hashlib
from urllib.parse import parse_qsl
from fastapi import APIRouter, HTTPException, Body
from dotenv import load_dotenv
from database import SessionLocal, upsert_user

# Load environment variables
load_dotenv()

# Set up router
router = APIRouter()

# Load token and mode
BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")
TEST_MODE = os.getenv("REACT_APP_TEST_MODE", "false").lower() == "true"

# Basic validation
if not BOT_TOKEN:
    raise ValueError("❌ TELEGRAM_TOKEN is not set in environment variables")

# Logging
logging.basicConfig(level=logging.DEBUG)
logging.debug(f"[AUTH] TEST_MODE={TEST_MODE}, TELEGRAM_TOKEN is set={bool(BOT_TOKEN)}")
logging.debug(f"[AUTH] Token repr: {repr(BOT_TOKEN)}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_telegram_auth(init_data_str: str) -> dict:
    logging.debug(f"🔥 Received auth payload: {init_data_str}")
    parsed_data = dict(parse_qsl(init_data_str, keep_blank_values=True))
    hash_to_verify = parsed_data.pop("hash", None)

    logging.debug(f"[AUTH] parsed initData, hash={hash_to_verify}")
    if not hash_to_verify:
        return {}

    # Sort and format data for hashing
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed_data.items())
    )

    # Secret key using bot token
    secret = hashlib.sha256(BOT_TOKEN.encode()).digest()

    # HMAC-SHA256 signature
    hmac_hash = hmac.new(secret, data_check_string.encode(), hashlib.sha256).hexdigest()

    if hmac_hash != hash_to_verify:
        logging.warning("❌ Hash mismatch: Auth failed")
        return {}

    logging.debug(f"✅ Verified user: {parsed_data}")
    return parsed_data


@router.post("/auth/telegram")
async def auth_telegram(payload: dict = Body(...)):
    init_data = payload.get("initData")
    verified_user = verify_telegram_auth(init_data)

    if not verified_user or "id" not in verified_user:
        raise HTTPException(status_code=403, detail="Telegram authentication failed")

    logging.debug(f"[AUTH] Saving verified user to DB: {verified_user}")
    db = SessionLocal()
    try:
        upsert_user(db, {
            "id": int(verified_user["id"]),
            "username": verified_user.get("username"),
            "first_name": verified_user.get("first_name"),
            "last_name": verified_user.get("last_name"),
            "photo_url": verified_user.get("photo_url"),
        })
    finally:
        db.close()

    return {"ok": True, "user_id": verified_user["id"]}
