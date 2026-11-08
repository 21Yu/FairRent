import asyncio
from pathlib import Path

import joblib
import pandas as pd

from app.core.config import settings
from app.db.postgres import db

BASE_DIR = Path(__file__).resolve().parents[2]
CSV_PATH = BASE_DIR / "app" / "ml" / "data" / "processed" / "rentfaster_listing.csv"
KMEANS_PATH = BASE_DIR / "app" / "ml" / "models" / "kmeans.pkl"


async def seed_database():
    await db.connect()
    try:
        dataframe = pd.read_csv(CSV_PATH)
        kmeans_model = joblib.load(KMEANS_PATH)
        dataframe["geo_cluster"] = kmeans_model.predict(dataframe[["latitude", "longitude"]])
        dataframe = dataframe.where(pd.notnull(dataframe), None)

        await db.execute("TRUNCATE TABLE listings", {})
        for record in dataframe.to_dict(orient="records"):
            if record.get("rentfaster_id") is None:
                continue
            record["_id"] = str(int(record.pop("rentfaster_id")))
            record.pop("id", None)
            await db.listings.insert_one(record)
        print("Successfully seeded PostgreSQL listings!")
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(seed_database())