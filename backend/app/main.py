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

@app.get("/rentals")
def get_rentals():
    return {
    "data": listing.head(10).to_dict(orient="records"),
    "count": 10
    }
# send lsiting to frontend
# filtering logic
# predictions