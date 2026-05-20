import pandas as pd
import joblib
from pathlib import Path
from fastapi import FastAPI
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent.parent

listing_path = BASE_DIR / "data" / "processed" / "rentfaster_listing.csv"
model_path = BASE_DIR / "models" / "xgb_boosting_tuned.pkl"
kmeans = joblib.load(BASE_DIR / "models" / "kmeans.pkl")
feature_columns = joblib.load(BASE_DIR / "models" / "features.pkl")

listing = pd.read_csv(listing_path)
model = joblib.load(model_path)

app = FastAPI()

# allow frontend origin
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fair-rent-five.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def filter_listing(df, price=None, type=None, beds=None, baths=None, squareFeet=None):
    
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

    return df

@app.get("/rentals")
def get_rentals(
    type: str | None = None,
    price: float | None = None,
    beds: float | None = None, 
    baths: float | None = None,
    squareFeet: float | None = None,
    north: float | None = None,
    south: float | None = None,
    east: float | None = None,
    west: float | None = None):
    result = filter_listing(listing.copy(), price, type, beds, baths, squareFeet)

    if None not in (north, south, east, west):
        result = result[(result["latitude"] <= north) &
                        (result["latitude"] >= south) &
                        (result["longitude"] <= east) &
                        (result["longitude"] >= west)]
        
    return result.head(100).to_dict(orient="records")

@app.get("/rental")
def get_rental(id: int):
    data = listing.copy();
    result = data[data["rentfaster_id"] == id];

    if result.empty:
        return {"error": "Rental not found"}

    return result.iloc[0].to_dict()

@app.get("/predict")
def get_predict(id: int):   
    result = listing[listing["rentfaster_id"] == id].copy();

    if result.empty:
        return {"error": "Rental not found"}
    
    result["geo_cluster"] = kmeans.predict(
        result[["latitude", "longitude"]]
    )

    result["sq_feet"] = np.log1p(result["sq_feet"])

    result["room_density"] = (
        result["beds"] / (result["sq_feet"] + 1)
    )

    result = pd.get_dummies(result, columns=['type'], prefix='type', dtype=int)

    for col in feature_columns:
        if col not in result:
            result[col] = 0

    X = result[feature_columns]

    prediction = model.predict(X)[0]

    return round(float(prediction), 2)
