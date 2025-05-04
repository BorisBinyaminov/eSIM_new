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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_telegram_auth(init_data_str: str) -> dict:
    logging.debug(f"🔥 Received auth payload: {init_data_str}")

    try:
        parsed_data = dict(parse_qsl(init_data_str, keep_blank_values=True))
        hash_to_verify = parsed_data.pop("hash", None)
        logging.debug(f"[AUTH] parsed initData, hash={hash_to_verify}")

        if not hash_to_verify:
            return {}

        data_check_arr = [f"{k}={v}" for k, v in sorted(parsed_data.items())]
        data_check_str = "\n".join(data_check_arr)

        secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
        hmac_obj = hmac.new(secret_key, msg=data_check_str.encode(), digestmod=hashlib.sha256)
        computed_hash = hmac_obj.hexdigest()

        if hmac.compare_digest(computed_hash, hash_to_verify):
            user_json = parsed_data.get("user")
            user_dict = json.loads(user_json)
            logging.debug(f"✅ Verified user: {user_dict}")
            return user_dict
        else:
            logging.warning("❌ Hash mismatch: Auth failed")
            return {}

    except Exception as e:
        logging.error(f"Error in verify_telegram_auth: {e}")
        return {}


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

