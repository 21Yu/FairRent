# Login, register, refresh from fastapi import APIRouter, HTTPException, status, Depends
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.db.mongodb import get_database
from app.core.security import hash_password, verify_password, create_access_token
from app.models.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db = Depends(get_database)):
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
    return {**user_in.dict(), "id": str(result.inserted_id)}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_database)):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"], "id": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}