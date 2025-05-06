import os
import hmac
import hashlib
import logging
from urllib.parse import parse_qsl
from fastapi import APIRouter, HTTPException, Body
from starlette.status import HTTP_403_FORBIDDEN
from database import upsert_user, SessionLocal
from operator import itemgetter
import json

router = APIRouter(prefix="/auth", tags=["auth"])

BOT_TOKEN = "8073824494:AAEfSGYAnUe4Pv8MV24dWIPcbHhDW2JMjJc"
TEST_MODE = os.getenv("TEST_MODE", "False").lower() == "true"

logger = logging.getLogger(__name__)


def verify_telegram_auth(init_data_str, token):
    try:
        parsed_data = dict(parse_qsl(init_data_str))
    except ValueError:
        # Init data is not a valid query string
        return False
    if "hash" not in parsed_data:
        # Hash is not present in init data
        return False

    hash_ = parsed_data.pop('hash')
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed_data.items(), key=itemgetter(0))
    )
    secret_key = hmac.new(
        key=b"WebAppData", msg=token.encode(), digestmod=hashlib.sha256
    )
    calculated_hash = hmac.new(
        key=secret_key.digest(), msg=data_check_string.encode(), digestmod=hashlib.sha256
    ).hexdigest()
    if calculated_hash == hash_:
        return json.loads(parsed_data['user'])
    else:
        return False

@router.post("/telegram")
async def auth_telegram(payload: dict = Body(...)):
    init_data_str = payload.get("initData")
    if not init_data_str:
        logger.warning("❌ initData missing from request")
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Missing initData")

    print("\n📦 Received initData:\n", init_data_str) 
    user_data = verify_telegram_auth(init_data_str, BOT_TOKEN)

    if not user_data:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Invalid Telegram auth")

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
