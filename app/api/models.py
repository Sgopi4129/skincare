from sqlalchemy import Column, Integer, String,DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True,nullable=False)
    email = Column(String(100), unique=True, index=True,nullable=False)
    password = Column(String(255),nullable=False)
    otp=Column(String(6),nullable=True)
    otp_expiry=Column(DateTime,nullable=True)


