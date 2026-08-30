from fastapi import APIRouter, HTTPException
from app.core.config import settings
from app.db.mongodb import get_database

router = APIRouter()

@router.post("/reset-db")
async def reset_database():
    # Safety check to prevent running in production
    if settings.ENVIRONMENT == "production":
        raise HTTPException(status_code=403, detail="Not allowed in production")
    
    db = await get_database()
    await db["users"].delete_many({})
    return {"status": "Database cleared"}