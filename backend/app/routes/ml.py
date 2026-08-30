import numpy as np
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from app.db.mongodb import get_database
from app.services.data_loader import data_store

router = APIRouter()

@router.get("/predict")
async def get_predict(id: int, db = Depends(get_database)):   
    rental = await db.listings.find_one({"rentfaster_id": id})

    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    # Convert MongoDB document into a single-row DataFrame for model feature pipeline
    rental["_id"] = str(rental["_id"])
    df_row = pd.DataFrame([rental])

    df_row["sq_feet"] = np.log1p(df_row["sq_feet"])
    df_row["room_density"] = df_row["beds"] / (df_row["sq_feet"] + 1)

    df_row = pd.get_dummies(df_row, columns=['type'], prefix='type', dtype=int)

    # Re-index feature columns safely to match model expectation
    df_row = df_row.reindex(columns=data_store.feature_columns, fill_value=0)

    prediction = data_store.model.predict(df_row)[0]
    return {"rentfaster_id": id, "predicted_price": round(float(prediction), 2)}

@router.get("/insights")
async def get_insights(id: int, db = Depends(get_database)):
    rental = await db.listings.find_one({"rentfaster_id": id})
    
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    current_price = float(rental["price"])
    cluster_id = rental.get("geo_cluster")
    
    # Fallback compute if geo_cluster was missing on record
    if cluster_id is None:
        lat = float(rental["latitude"])
        lon = float(rental["longitude"])
        cluster_id = int(data_store.kmeans.predict([[lat, lon]])[0])

    # Perform cluster aggregation natively inside MongoDB
    pipeline = [
        {"$match": {"geo_cluster": cluster_id}},
        {
            "$group": {
                "_id": "$geo_cluster",
                "avg_price": {"$avg": "$price"},
                "count": {"$sum": 1}
            }
        }
    ]
    
    aggregate_res = await db.listings.aggregate(pipeline).to_list(length=1)
    
    if not aggregate_res:
        raise HTTPException(status_code=404, detail="Cluster insights unavailable")

    cluster_avg_price = float(aggregate_res[0]["avg_price"])
    cluster_count = int(aggregate_res[0]["count"])

    diff_pct = round(((current_price - cluster_avg_price) / cluster_avg_price) * 100, 1)

    return {
        "rentfaster_id": id,
        "average_price": round(cluster_avg_price, 2),
        "total_properties_in_cluster": cluster_count,
        "difference_percentage": diff_pct
    }