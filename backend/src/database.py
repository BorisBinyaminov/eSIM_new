import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from sqlalchemy.orm import Session
from models import Base, User

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL is not set in your environment variables.")

engine = create_engine(DATABASE_URL, echo=True)  # echo=True for SQL logging
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def upsert_user(db: Session, user_data: dict) -> User:
    telegram_id = str(user_data.get("id"))
    if not telegram_id:
        raise ValueError("telegram_id is required")

    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if user:
        user.username = user_data.get("username")
        user.photo_url = user_data.get("photo_url")
        user.last_login = datetime.utcnow()
    else:
        user = User(
            telegram_id=telegram_id,
            username=user_data.get("username"),
            photo_url=user_data.get("photo_url"),
            last_login=datetime.utcnow(),
        )
        db.add(user)

    db.commit()
    db.refresh(user)
    return user


