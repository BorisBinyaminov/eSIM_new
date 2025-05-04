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

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")
TEST_MODE = os.getenv("TEST_MODE", "False").lower() == "true"

logger = logging.getLogger(__name__)


def verify_telegram_auth(init_data_str: str) -> dict:
    logger.debug("🔥 Received auth payload: %s", init_data_str)

    try:
        data = dict(parse_qsl(init_data_str, keep_blank_values=True))
        received_hash = data.pop("hash", None)
    except Exception as e:
        logger.error("❌ Failed to parse initData: %s", e)
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Invalid initData")

    logger.debug("[AUTH] parsed initData, hash=%s", received_hash)

    if not received_hash:
        logger.warning("❌ No hash provided in initData")
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Missing hash")

    auth_data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(data.items())
    )

    if not BOT_TOKEN:
        logger.error("❌ TELEGRAM_BOT_TOKEN is not set in the environment")
        raise HTTPException(status_code=500, detail="Bot token not configured")

    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, auth_data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(computed_hash, received_hash):
        logger.warning("❌ Hash mismatch: Auth failed")
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Telegram authentication failed")

    # Decode user JSON
    user_json = data.get("user")
    try:
        user_data = json.loads(user_json)
    except Exception as e:
        logger.error("❌ Failed to parse user JSON: %s", e)
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Invalid user format")

    logger.debug("✅ Verified user: %s", user_data)
    return user_data


@router.post("/auth/telegram")
async def auth_telegram(payload: dict = Body(...)):
    init_data_str = payload.get("initData")
    if not init_data_str:
        logger.warning("❌ initData missing from request")
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Missing initData")

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
