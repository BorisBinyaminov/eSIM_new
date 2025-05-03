# database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from sqlalchemy.orm import Session

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL is not set in your environment variables.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from models import User
from datetime import datetime

def upsert_user_from_telegram(user_data: dict, db: Session):
    user = db.query(User).filter_by(telegram_id=user_data["telegram_id"]).first()

    if user:
        user.last_login = datetime.utcnow()
        if not user.photo_url and user_data.get("photo_url"):
            user.photo_url = user_data["photo_url"]
    else:
        user = User(
            telegram_id=user_data["telegram_id"],
            username=user_data.get("username"),
            photo_url=user_data.get("photo_url"),
            last_login=datetime.utcnow(),
        )
        db.add(user)

    db.commit()
