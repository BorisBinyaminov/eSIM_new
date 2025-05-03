from sqlalchemy import Column, Integer, String, DateTime, BigInteger, Text, UniqueConstraint
from sqlalchemy.sql import func
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id           = Column(Integer, primary_key=True, index=True)
    telegram_id  = Column(String, unique=True, index=True, nullable=False)
    username     = Column(String, index=True)
    photo_url    = Column(String, nullable=True)
    last_login   = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User {self.telegram_id} username={self.username}>"

class Order(Base):
    __tablename__   = "orders"
    __table_args__  = (UniqueConstraint("order_id", "iccid", name="uq_order_iccid"),)

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(String, index=True)
    package_code    = Column(String, nullable=False)
    order_id        = Column(String, index=True)
    transaction_id  = Column(String, index=True)
    iccid           = Column(String, nullable=True)

    count           = Column(Integer, default=1)
    period_num      = Column(Integer, nullable=True)
    price           = Column(Integer)
    retail_price    = Column(Integer)
    qr_code         = Column(String)
    status          = Column(String, default="initiated")
    details         = Column(Text, nullable=True)

    esim_status     = Column(String)
    smdp_status     = Column(String)
    expired_time    = Column(DateTime(timezone=True))
    total_volume    = Column(BigInteger)
    total_duration  = Column(Integer)
    order_usage     = Column(BigInteger)
    esim_list       = Column(Text)
    package_list    = Column(Text)

    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())
    last_update_time= Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Order {self.iccid} status={self.status}>"
