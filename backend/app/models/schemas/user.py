from pydantic import BaseModel, EmailStr
from typing import List

class UserCreate(BaseModel):
    email: EmailStr
    password: str 
    user_name: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    user_name: str
    saved_listings: List[str] = []

class SaveListingRequest(BaseModel):
    listing_id: str

