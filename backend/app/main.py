import pandas as pd
import joblib
from pathlib import Path
from fastapi import FastAPI
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Response

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

def filter_listing(price=None, type=None, beds=None, baths=None, squareFeet=None):
    result = listing

    if type:
        result = listing[listing["type"] == type]

    if price is not None:
        result = listing[listing["price"] <= price]

    if beds is not None:
        result = listing[listing["beds"] <= beds]

    if baths is not None:
        result = listing[listing["baths"] <= baths]

    if squareFeet is not None:
        result = listing[listing["sq_feet"] <= squareFeet]

    return result

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
    result = filter_listing(price, type, beds, baths, squareFeet)

    if None not in (north, south, east, west):
        result = result[(result["latitude"] <= north) &
                        (result["latitude"] >= south) &
                        (result["longitude"] <= east) &
                        (result["longitude"] >= west)]
        
    return result.head(100).to_dict(orient="records")

@app.get("/rental")
def get_rental(id: int):
    result = listing[listing["rentfaster_id"] == id];

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

@app.get("/insights")
def get_insights(id: int):
    rental = listing[listing["rentfaster_id"] == id]
    if rental.empty:
        return {"error": "Rental not found"}
    
    lat = float(rental["latitude"].iloc[0])
    lon = float(rental["longitude"].iloc[0])
    current_price = float(rental["price"].iloc[0])
    
    cluster_id = int(kmeans.predict([[lat, lon]])[0])

    temp = listing.copy()
    temp["geo_cluster"] = kmeans.predict(temp[["latitude", "longitude"]])

    cluster_listings = temp[temp["geo_cluster"] == cluster_id]
    cluster_avg_price = float(cluster_listings["price"].mean())
    cluster_count = int(len(cluster_listings))

    diff_pct = round(((current_price - cluster_avg_price) / cluster_avg_price) * 100, 1)

    return {
        "average_price": round(cluster_avg_price, 2),
        "total_properties_in_cluster": cluster_count,
        "difference_percentage": diff_pct
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the FairRent API"}

@app.api_route("/health", methods=["HEAD"])
def head_health_check():
    return Response(status_code=200)