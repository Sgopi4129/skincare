from pydantic import BaseModel,EmailStr
from typing import Optional


class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password: str

class UserResponse(BaseModel):
    id:int
    username:str
    email:str

    class Config:
        orm_mode=True

class OTPRequest(BaseModel):
    email:str | None = None
    username:str | None = None

class VerifyOTPRequest(BaseModel):
    identifier:str
    otp:str

