from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database.connection import get_connection
from passlib.context import CryptContext
from jose import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os

load_dotenv()

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "temporary-secret-key"
)

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register_user(data: RegisterRequest):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT id FROM users WHERE email = %s",
        (data.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(
        data.password
    )

    cursor.execute(
        """
        INSERT INTO users
        (name, email, password)
        VALUES (%s, %s, %s)
        """,
        (
            data.name,
            data.email,
            hashed_password
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(data: LoginRequest):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, name, email, password
        FROM users
        WHERE email = %s
        """,
        (data.email,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
    "sub": user["email"],
    "user_id": user["id"],
    "name": user["name"],
    "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }

    access_token = jwt.encode(
        token_data,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }