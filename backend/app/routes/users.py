from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.db.mongodb import get_database

from app.core.security import hash_password, verify_password, create_access_token
from app.middleware.auth_middleware import get_current_user
from app.models.schemas.user import SaveListingRequest, UserResponse, UserCreate

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db = Depends(get_database)):
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "email": user_in.email,
        "hashed_password": hash_password(user_in.password),
        "user_name": user_in.user_name,
        "saved_listings": []
    }
    result = await db.users.insert_one(user_doc)
    return {
        "id": str(result.inserted_id),
        "email": user_in.email,
        "user_name": user_in.user_name,
        "saved_listings": []
    }

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db = Depends(get_database)
):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user["email"], "id": str(user["_id"])})
    
    # Return JSON body containing access token and token_type
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout():
    # Token invalidation on Bearer auth is managed client-side (e.g., deleting token from storage)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "user_name": current_user["user_name"],
        "saved_listings": current_user["saved_listings"]
    }

# save a listing
@router.post("/saved-listings")
async def save_listing(
    payload: SaveListingRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    listing_id = payload.listing_id

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"saved_listings": listing_id}}
    )
    return {"message": "Listing saved successfully", "listing_id": listing_id}

# unsave a listing
@router.delete("/saved-listings/{listing_id}")
async def remove_saved_listing(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    listing_id = str(listing_id)

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$pull": {"saved_listings": listing_id}}
    )
    return {"message": "Listing removed successfully", "listing_id": listing_id}

# get all saved listings
@router.get("/saved-listings")
async def get_saved_listings(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    saved_ids = current_user.get("saved_listings", [])

    listings = await db.listings.find({"_id": {"$in": saved_ids}}).to_list(length=100)
    
    for listing in listings:
        listing["_id"] = str(listing["_id"])
        
    return listings