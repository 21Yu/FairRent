import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from app.services.data_loader import data_store

router = APIRouter()

@router.get("/predict/{id}")
def get_predict(id: int):   
    rental = data_store.listing[data_store.listing["rentfaster_id"] == id]

    if rental.empty:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    # Work on a copy of the single row matching the ID
    df_row = rental.copy()

    df_row["geo_cluster"] = data_store.kmeans.predict(
        df_row[["latitude", "longitude"]]
    )
    df_row["sq_feet"] = np.log1p(df_row["sq_feet"])
    df_row["room_density"] = df_row["beds"] / (df_row["sq_feet"] + 1)

    df_row = pd.get_dummies(df_row, columns=['type'], prefix='type', dtype=int)

    # Re-index feature columns safely
    df_row = df_row.reindex(columns=data_store.feature_columns, fill_value=0)

    prediction = data_store.model.predict(df_row)[0]
    return {"rentfaster_id": id, "predicted_price": round(float(prediction), 2)}

@router.get("/insights/{id}")
def get_insights(id: int):
    rental = data_store.listing[data_store.listing["rentfaster_id"] == id]
    
    if rental.empty:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    lat = float(rental["latitude"].iloc[0])
    lon = float(rental["longitude"].iloc[0])
    current_price = float(rental["price"].iloc[0])
    
    cluster_id = int(data_store.kmeans.predict([[lat, lon]])[0])

    # Leverage pre-calculated geo_clusters instead of re-predicting entire dataframe
    cluster_listings = data_store.listing[data_store.listing["geo_cluster"] == cluster_id]
    
    cluster_avg_price = float(cluster_listings["price"].mean())
    cluster_count = int(len(cluster_listings))

    diff_pct = round(((current_price - cluster_avg_price) / cluster_avg_price) * 100, 1)

    return {
        "rentfaster_id": id,
        "average_price": round(cluster_avg_price, 2),
        "total_properties_in_cluster": cluster_count,
        "difference_percentage": diff_pct
    }