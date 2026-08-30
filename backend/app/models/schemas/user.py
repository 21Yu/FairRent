from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str 
    user_name: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    user_name: str

