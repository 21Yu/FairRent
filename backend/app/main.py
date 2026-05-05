import pandas as pd
import joblib
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent.parent

listing_path = BASE_DIR / "data" / "processed" / "rentfaster_listing.csv"
model_path = BASE_DIR / "models" / "xgb_boosting_tuned.pkl"

listing = pd.read_csv(listing_path)
model = joblib.load(model_path)

app = FastAPI()


# allow frontend origin
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def filter_listing(df, price=None, type=None, beds=None, baths=None, squareFeet=None):
    
    if price is not None:
        df = df[df["price"] <= price]
    
    if type:
        if type == "apartment":
            df = df[df["type_apartment"] == 1]

        if type == "basement":
            df = df[df["type_basement"] == 1]

        if type == "duplex":
            df = df[df["type_duplex"] == 1]   

        if type == "house":
            df = df[df["type_house"] == 1]   

        if type == "townhouse":
            df = df[df["type_townhouse"] == 1]   

        if type == "other":
            df = df[df["type_other"] == 1]   

    if beds is not None:
        df = df[df["beds"] == beds]

    if baths is not None:
        df = df[df["baths"] == baths]

    if squareFeet is not None:
        df = df[df["sq_feet"] <= squareFeet]

    return df

@app.get("/rentals")
def get_rentals(price: float = None, type: str = None, beds: int = None, baths: float = None, squareFeet: float = None):
    result = filter_listing(listing.copy(), price, type, beds, baths, squareFeet)
    return result.to_dict(orient="records")

# filtering logic
# predictions