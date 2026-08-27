from pathlib import Path
import pandas as pd
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent

class DataContainer:
    listing: pd.DataFrame = None
    model = None
    kmeans = None
    feature_columns: list = None

data_store = DataContainer()

def load_artifacts():
    listing_path = BASE_DIR / "ml" / "data" / "processed" / "rentfaster_listing.csv"
    model_path = BASE_DIR / "ml" / "models" / "xgb_boosting_tuned.pkl"
    kmeans_path = BASE_DIR / "ml" / "models" / "kmeans.pkl"
    features_path = BASE_DIR / "ml" / "models" / "features.pkl"

    data_store.listing = pd.read_csv(listing_path)
    data_store.model = joblib.load(model_path)
    data_store.kmeans = joblib.load(kmeans_path)
    data_store.feature_columns = joblib.load(features_path)

    # Pre-calculate geo_cluster for the whole dataset once on startup
    # to avoid expensive re-predictions during get_insights calls
    coords = data_store.listing[["latitude", "longitude"]]
    data_store.listing["geo_cluster"] = data_store.kmeans.predict(coords)