from pydantic import BaseModel, EmailStr, Field
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
    is_admin: bool = False

class AdminUserUpdate(BaseModel):
    email: EmailStr | None = None
    user_name: str | None = Field(default=None, min_length=1)
    password: str | None = Field(default=None, min_length=1)

class SaveListingRequest(BaseModel):
    listing_id: str

class UserUpdate(BaseModel):
    user_name: str | None = Field(default=None, min_length=1)
    password: str | None = Field(default=None, min_length=1)

