from pathlib import Path
import pandas as pd
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent

class DataContainer:
    model = None
    kmeans = None
    feature_columns: list = None

data_store = DataContainer()

def load_artifacts():
    model_path = BASE_DIR / "ml" / "models" / "xgb_boosting_tuned.pkl"
    kmeans_path = BASE_DIR / "ml" / "models" / "kmeans.pkl"
    features_path = BASE_DIR / "ml" / "models" / "features.pkl"

    data_store.model = joblib.load(model_path)
    data_store.kmeans = joblib.load(kmeans_path)
    data_store.feature_columns = joblib.load(features_path)
