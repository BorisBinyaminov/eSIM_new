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
from urllib.parse import parse_qsl

load_dotenv()

router = APIRouter()
BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")
if not BOT_TOKEN:
    raise ValueError("❌ TELEGRAM_TOKEN is not set in environment variables")
TEST_MODE = os.getenv("REACT_APP_TEST_MODE", "false").lower() == "true"

logging.basicConfig(level=logging.DEBUG)
logging.debug(f"[AUTH] TEST_MODE={TEST_MODE}, TELEGRAM_TOKEN is={BOT_TOKEN}")
logging.debug(f"[AUTH] Token repr: {repr(BOT_TOKEN)}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_telegram_auth(init_data_str: str) -> dict:
    from urllib.parse import parse_qsl
    import hmac, hashlib, logging

    logging.debug(f"🔥 Received auth payload: {init_data_str}")

    parsed_data = dict(parse_qsl(init_data_str, keep_blank_values=True))
    hash_to_verify = parsed_data.pop("hash", None)

    logging.debug(f"[AUTH] parsed initData, hash={hash_to_verify}")
    if not hash_to_verify:
        return {}

    # Step 1: Sort and format data
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed_data.items())
    )

    # Step 2: Create secret key
    secret = hashlib.sha256(BOT_TOKEN.encode()).digest()

    # Step 3: Generate HMAC SHA256
    hmac_hash = hmac.new(secret, data_check_string.encode(), hashlib.sha256).hexdigest()

    if hmac_hash != hash_to_verify:
        logging.warning(f"❌ Hash mismatch: Auth failed")
        return {}

    logging.debug(f"✅ Verified user: {parsed_data}")
    return parsed_data


@router.post("/auth/telegram")
async def auth_telegram(payload: dict = Body(...)):
    init_data = payload.get("initData")
    verified_user = verify_telegram_auth(init_data)

    if not verified_user or "id" not in verified_user:
        raise HTTPException(status_code=403, detail="Telegram authentication failed")

    logging.debug(f"[AUTH] Saving verified user: {verified_user}")
    db = SessionLocal()
    try:
        upsert_user(db, {
            "id": verified_user["id"],
            "username": verified_user.get("username"),
            "first_name": verified_user.get("first_name"),
            "last_name": verified_user.get("last_name"),
            "photo_url": verified_user.get("photo_url"),
        })
    finally:
        db.close()

    return {"ok": True, "user_id": verified_user["id"]}

