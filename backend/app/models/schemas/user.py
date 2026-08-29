from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    user_name: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    user_name: str

