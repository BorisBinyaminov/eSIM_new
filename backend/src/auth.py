import os
import json
import hmac
import hashlib
import logging
from urllib.parse import parse_qsl

from fastapi import APIRouter, HTTPException, Body
from starlette.status import HTTP_403_FORBIDDEN

from database import upsert_user, SessionLocal

router = APIRouter(prefix="/auth", tags=["auth"])

BOT_TOKEN = "8073824494:AAEfSGYAnUe4Pv8MV24dWIPcbHhDW2JMjJc"
TEST_MODE = os.getenv("TEST_MODE", "False").lower() == "true"

logger = logging.getLogger(__name__)


def verify_telegram_auth(init_data_str: str) -> dict:
    import time

    logger.debug("🔥 Received initData string:\n%s", init_data_str)

    try:
        parsed_items = list(parse_qsl(init_data_str, keep_blank_values=True))
        data = {k.strip(): v.strip() for k, v in parsed_items}
        received_hash = data.pop("hash", None)
    except Exception as e:
        logger.error("❌ Failed to parse initData: %s", e)
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Invalid initData format")

    if not received_hash:
        logger.warning("❌ Missing 'hash' in initData")
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Missing hash")

    # ✅ Print parsed fields
    print("🔍 Parsed initData fields:")
    for k, v in sorted(data.items()):
        print(f"  {k} = {v}")

    # ✅ Optional: check if auth_date is fresh (within 24 hours)
    try:
        auth_date = int(data.get("auth_date", "0"))
        if time.time() - auth_date > 86400:
            logger.warning("⏳ initData is expired")
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="initData is too old")
    except Exception as e:
        logger.warning("⚠️ Invalid or missing auth_date: %s", e)

    # ✅ Build the HMAC base string safely
    try:
        auth_data_check_string = "\n".join(
            f"{k}={v}" for k, v in sorted(data.items())
        )
        print("🧾 Final HMAC base string:")
        for line in auth_data_check_string.split("\n"):
            print(f"[{line}]")
    except Exception as e:
        logger.error("❌ Failed to build check_string: %s", e)
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Failed to prepare hash check")

    if not BOT_TOKEN:
        logger.critical("❌ TELEGRAM_TOKEN is not set in environment")
        raise HTTPException(status_code=500, detail="Bot token not configured")

    # ✅ Compute and compare hashes
    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, auth_data_check_string.encode(), hashlib.sha256).hexdigest()

    print("✅ Computed Hash :", computed_hash)
    print("📦 Received Hash :", received_hash)
    print("🎯 Match         :", hmac.compare_digest(computed_hash, received_hash))

    if not hmac.compare_digest(computed_hash, received_hash):
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Telegram authentication failed")

    # ✅ Parse user JSON
    try:
        user_json = data.get("user")
        user_data = json.loads(user_json)
        logger.info("✅ Verified Telegram user ID: %s", user_data.get("id"))
    except Exception as e:
        logger.error("❌ Invalid user JSON: %s", e)
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Invalid user data")

    return user_data

@router.post("/telegram")
async def auth_telegram(payload: dict = Body(...)):
    init_data_str = payload.get("initData")
    if not init_data_str:
        logger.warning("❌ initData missing from request")
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Missing initData")
    #logger("\n📦 Received initData:\n", init_data_str) 
    print("\n📦 Received initData:\n", init_data_str) 
    user_data = verify_telegram_auth(init_data_str)

    db = SessionLocal()
    try:
        user = upsert_user(db, {
            "id": user_data.get("id"),
            "username": user_data.get("username"),
            "first_name": user_data.get("first_name"),
            "last_name": user_data.get("last_name"),
            "photo_url": user_data.get("photo_url"),
        })
        return {"ok": True, "user_id": user.id}
    finally:
        db.close()
