from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.db.mongodb import get_database

from app.core.security import hash_password, verify_password, create_access_token
from app.models.schemas.user import UserCreate, UserResponse
from app.models.schemas.token import Token
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db = Depends(get_database)):
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "email": user_in.email,
        "hashed_password": hash_password(user_in.password),
        "full_name": user_in.full_name,
        "saved_listings": []
    }
    result = await db.users.insert_one(user_doc)
    return {
        "id": str(result.inserted_id),
        "email": user_in.email,
        "full_name": user_in.full_name
    }

@router.post("/login")
async def login(
    response: Response, 
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db = Depends(get_database)
):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"], "id": str(user["_id"])})
    
    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,  # Prevents client-side JS from reading the cookie (XSS protection)
        secure=True,    # Set to True in production (requires HTTPS)
        samesite="lax", # Helps mitigate CSRF attacks
        max_age=1800    # Cookie expiration in seconds (e.g., 30 mins)
    )
    
    return {"message": "Login successful" }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

