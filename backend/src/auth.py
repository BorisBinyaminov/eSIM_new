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
async def auth_telegram(payload: dict = Body(...)):
    init_data = payload.get("initData")
    if not init_data:
        raise HTTPException(status_code=400, detail="Missing initData")

    verified_user = verify_telegram_auth(init_data)
    if not verified_user:
        raise HTTPException(status_code=403, detail="Invalid Telegram authentication")

    # Save or update user in DB
    with SessionLocal() as db:
        upsert_user(db, verified_user)

    return {"status": "ok"}

