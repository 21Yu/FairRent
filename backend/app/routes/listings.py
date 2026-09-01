from fastapi import APIRouter, Depends, HTTPException, Query
from app.db.mongodb import get_database

router = APIRouter()

@router.get("/")
async def get_listings(
    type: str | None = None,
    price: float | None = Query(None, ge=0),
    beds: float | None = Query(None, ge=0), 
    baths: float | None = Query(None, ge=0),
    squareFeet: float | None = Query(None, ge=0),
    north: float | None = None,
    south: float | None = None,
    east: float | None = None,
    west: float | None = None,
    db = Depends(get_database)
):
    query = {}

    if type:
        query["type"] = type
    if price is not None:
        query["price"] = {"$lte": price}
    if beds is not None:
        query["beds"] = {"$lte": beds}
    if baths is not None:
        query["baths"] = {"$lte": baths}
    if squareFeet is not None:
        query["sq_feet"] = {"$lte": squareFeet}

    # Dynamic Leaflet map bounds query using MongoDB 2dsphere indexing
    if None not in (north, south, east, west):
        query["location"] = {
            "$geoWithin": {
                "$box": [
                    [west, south],  # Bottom-left (SW)
                    [east, north]   # Top-right (NE)
                ]
            }
        }

    listings = await db.listings.find(query).limit(100).to_list(length=100)

    for listing in listings:
        listing["_id"] = str(listing["_id"])

    return listings

@router.get("/{id}")
async def get_listing(id: str, db = Depends(get_database)):
    listing = await db.listings.find_one({"_id": id})

    if not listing:
        raise HTTPException(status_code=404, detail="Rental not found")

    listing["_id"] = str(listing["_id"])
    return listing