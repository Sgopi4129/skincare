from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from models import Base, User
from database import SessionLocal, engine
from schemas import UserResponse, UserCreate,OTPRequest,VerifyOTPRequest
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail,MessageSchema,ConnectionConfig
import random,os
from dotenv import load_dotenv
from datetime import datetime,timedelta

load_dotenv()

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to restrict specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Create all database tables
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

otp_store={}

def get_email_config(user_email:str) -> ConnectionConfig:
    """
    Dynamically generate the email configuration for the given user.
    """
    return ConnectionConfig(
        MAIL_USERNAME='shobbit168@gmail.com',
        MAIL_PASSWORD='vkavlcuomvpgjjho',
        MAIL_FROM='shobbit168@gmail.com',
        MAIL_PORT=465,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=False,
        MAIL_SSL_TLS=True,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
        )


@app.post("/register/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    # Check if email already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Hash the password and create a new user
    hashed_password = bcrypt.hash(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Return the created user
    return new_user

@app.get("/users/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    # Fetch all users
    users = db.query(User).all()
    return users

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    # Fetch a single user by ID
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
@app.post("/send-otp")
async def send_otp(request:OTPRequest,db:Session=Depends(get_db)):
    if not request.email and not request.username:
        raise HTTPException(status_code=400,detail="Email or username is required.")
    identifier=request.email or request.username

    print(f"Received identifier: {identifier}")
    user=None


    if "@" in identifier:
        print(f"Querying for email: {identifier}")
        user=db.query(User).filter(User.email==identifier).first()
    else:
        print(f"Querying for username: {identifier}")
        user=db.query(User).filter(User.username==identifier).first()
    
    print(f"Searching for user with identifier: {identifier}")

    if user:
        otp=str(random.randint(100000,999999))
        otp_expiry= datetime.utcnow()+timedelta(minutes=5)
        user.otp=otp
        user.otp_expiry=otp_expiry
        db.commit()

        email_config=get_email_config(user.email)
        message=MessageSchema(
            subject="Your OTP Code",
            recipients=[user.email],
            body=f"Hello {user.username},\n\nYour OTP code is {otp}. It will expire in 5 minutes.\n\nThank you!",
            subtype="plain"
        )
        fm=FastMail(email_config)
        try:
            await fm.send_message(message)
            return {"message":"OTP sent successfully."}
        except Exception as e:
            raise HTTPException(status_code=500,detail=f"Failed to send OTP:{str(e)}")
        return {"message":"OTP sent successfully."}
    print("User not found.")
    raise HTTPException(status_code=404,detail="Use not found.")

@app.post("/verify-otp")
def verify_otp(request:VerifyOTPRequest,db:Session=Depends(get_db)):
    identifier=request.identifier
    entered_otp=request.otp
    user=None
    if "@" in identifier:
        user=db.query(User).filter(User.email==identifier).first()
    else:
        user=db.query(User).filter(User.username==identifier).first()
    if user:
        if user.otp_expiry and datetime.utcnow() >user.otp_expiry:
            raise HTTPException(status_code=400,detail="OTP has expired.")
        
        if entered_otp==user.otp:
            return {"username":user.username}
        else:
            raise HTTPException(status_code=400,detail="Invalid OTP.")
    else:
        raise HTTPException(status_code=404,detail='User not found.')
    
