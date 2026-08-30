import asyncio
from pathlib import Path
import joblib
import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

BASE_DIR = Path(__file__).resolve().parents[2]

CSV_PATH = BASE_DIR / "app" / "ml" / "data" / "processed" / "rentfaster_listing.csv"
# Point directly to your saved kmeans model file:
KMEANS_PATH = BASE_DIR / "app" / "ml" / "models" / "kmeans.pkl"  # Adjust filename/extension if needed


async def seed_database():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    print(f"Loading CSV data from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)

    # Load K-Means model directly from disk
    print(f"Loading K-Means model from {KMEANS_PATH}...")
    kmeans_model = joblib.load(KMEANS_PATH)
    df["geo_cluster"] = kmeans_model.predict(df[["latitude", "longitude"]])

    # Clean NaNs so MongoDB insertion doesn't break
    df = df.where(pd.notnull(df), None)

    records = df.to_dict(orient="records")

    for record in records:
        if "rentfaster_id" in record and record["rentfaster_id"] is not None:
            record["id"] = str(record["rentfaster_id"])
            record["rentfaster_id"] = int(record["rentfaster_id"])

        lat = record.get("latitude")
        lng = record.get("longitude")
        if lat is not None and lng is not None:
            record["location"] = {
                "type": "Point",
                "coordinates": [float(lng), float(lat)],
            }

    print("Clearing existing listings collection...")
    await db.listings.delete_many({})

    print(f"Inserting {len(records)} listing records...")
    if records:
        await db.listings.insert_many(records)

    print("Creating indexes...")
    await db.listings.create_index([("location", "2dsphere")])
    await db.listings.create_index("id", unique=True)
    await db.listings.create_index("rentfaster_id")
    await db.listings.create_index("price")
    await db.listings.create_index("type")
    await db.listings.create_index("geo_cluster")
    await db.listings.create_index([("beds", 1), ("baths", 1)])

    print("Successfully seeded MongoDB listings!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())