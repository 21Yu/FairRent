from fastapi import APIRouter, HTTPException, Query
from app.services.data_loader import data_store

router = APIRouter()

@router.get("/")
def get_rentals(
    type: str | None = None,
    price: float | None = Query(None, ge=0),
    beds: float | None = Query(None, ge=0), 
    baths: float | None = Query(None, ge=0),
    squareFeet: float | None = Query(None, ge=0),
    north: float | None = None,
    south: float | None = None,
    east: float | None = None,
    west: float | None = None
):
    df = data_store.listing

    if type:
        df = df[df["type"] == type]
    if price is not None:
        df = df[df["price"] <= price]
    if beds is not None:
        df = df[df["beds"] <= beds]
    if baths is not None:
        df = df[df["baths"] <= baths]
    if squareFeet is not None:
        df = df[df["sq_feet"] <= squareFeet]

    if None not in (north, south, east, west):
        df = df[
            (df["latitude"] <= north) &
            (df["latitude"] >= south) &
            (df["longitude"] <= east) &
            (df["longitude"] >= west)
        ]
        
    return df.head(100).to_dict(orient="records")

@router.get("/{id}")
def get_rental(id: int):
    result = data_store.listing[data_store.listing["rentfaster_id"] == id]

    if result.empty:
        raise HTTPException(status_code=404, detail="Rental not found")

    return result.iloc[0].to_dict()