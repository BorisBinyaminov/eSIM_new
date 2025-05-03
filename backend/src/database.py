import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL is not set in your environment variables.")

engine = create_engine(DATABASE_URL, echo=True)  # echo=True for SQL logging
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# import here to avoid circular at module‐load time
from models import User  # noqa: E402

def upsert_user_from_telegram(data: dict, db=None):
    """
    Insert or update a Telegram user record.
    If you pass an existing Session, it will reuse it; otherwise it opens/closes its own.
    """
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        telegram_id = str(data["id"])
        username    = data.get("username") or data.get("first_name")
        photo_url   = data.get("photo_url")
        now         = datetime.utcnow()

        # Try fetch
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        if user:
            # Update
            user.last_login = now
            if username:
                user.username = username
            if photo_url:
                user.photo_url = photo_url
            print(f"[DB] Updated User {telegram_id}")
        else:
            # Insert
            user = User(
                telegram_id=telegram_id,
                username=username,
                photo_url=photo_url,
                last_login=now
            )
            db.add(user)
            print(f"[DB] Created User {telegram_id}")

        db.commit()
        return user

    finally:
        if own_session:
            db.close()
