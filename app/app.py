import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os

st.set_page_config(page_title="FairRent Predictor", page_icon="🏠", layout="centered")

model_path = os.path.join("models", "xgb_boosting_tuned.pkl")
data_path = os.path.join("data", "processed", "rentfaster_clean.csv")

try:
    model = joblib.load(model_path)
    data = pd.read_csv(data_path)
except FileNotFoundError:
    st.error("Required model or data files not found. Please check the paths.")
    st.stop()

st.title("FairRent Prediction App")
st.write("Estimate a fair rental price based on your property details and location.")

# dynamic input
beds_min, beds_max = int(data["beds"].min()), int(data["beds"].max())
baths_min, baths_max = int(data["baths"].min()), int(data["baths"].max())
sq_min, sq_max = int(data["sq_feet"].min()), int(data["sq_feet"].max())
lease_min, lease_max = int(data["lease_term_months"].min()), int(data["lease_term_months"].max())
avail_min, avail_max = int(data["availability_days"].min()), int(data["availability_days"].max())

# city and province
provinces = sorted(data["province"].dropna().unique())
selected_province = st.selectbox("Select Province", provinces)

filter_cities = data.loc[data["province"] == selected_province, "city"].dropna().unique()
cities = sorted(filter_cities)
selected_city = st.selectbox("Select City", cities)

# look up location average rent
match = data[(data["city"] == selected_city) & (data["province"] == selected_province)]
if len(match) > 0:
    location_avg_price = match["location_avg_price"].iloc[0]
else:
    st.error("No data available for selected location")
    st.stop()

st.markdown(f"**Average rent in {selected_city}, {selected_province}:** ${location_avg_price:,.0f}")

# form
with st.form("rent_prediction_form"):
    st.subheader("Property Details")
    col1, col2 = st.columns(2)
    with col1:
        beds = st.number_input("Bedrooms", min_value=beds_min, max_value=beds_max)
        baths = st.number_input("Bathrooms", min_value=baths_min, max_value=baths_max)
        sq_feet = st.number_input("Square Feet", min_value=sq_min, max_value=sq_max)
    with col2:
        lease_term_months = st.number_input("Lease Term (Months)", min_value=lease_min, max_value=lease_max)
        availability_days = st.slider("Available In (Days)", avail_min, avail_max)
    
    st.subheader("Other Features")


    furnishing = st.radio("Furnished?", ["Unfurnished", "Furnished", "Negotiable"])
    furnishing_map = {"Unfurnished": 0, "Furnished": 1, "Negotiable": 2}
    furnishing = furnishing_map[furnishing]
    
    smoking = st.radio("Smoking Allowed?", ["Non-Smoking", "Smoking Allowed", "Negotiable"])
    smoking_map = {"Non-Smoking": 0, "Smoking Allowed": 1, "Negotiable": 2}
    smoking = smoking_map[smoking]

    cats = st.radio("Cats Allowed?", ["No", "Yes"])
    cats_map = {"No": 0, "Yes": 1}
    cats = cats_map[cats]

    dogs = st.radio("Dogs Allowed?", ["No", "Yes"])
    dogs_map = {"No": 0, "Yes": 1}
    dogs = dogs_map[dogs]

    st.subheader("Property Type")
    property_type = st.selectbox(
        "Type of Property",
        ["Apartment", "Basement", "Duplex", "House", "Townhouse"]
    )

    submitted = st.form_submit_button("Predict Rent")


# predict rent
if submitted:

    # One-hot encode property type
    type_apartment = 1 if property_type == "Apartment" else 0
    type_basement = 1 if property_type == "Basement" else 0
    type_duplex = 1 if property_type == "Duplex" else 0
    type_house = 1 if property_type == "House" else 0
    type_townhouse = 1 if property_type == "Townhouse" else 0

    features = [[
        beds, baths, sq_feet, furnishing, smoking,
        cats, dogs, location_avg_price, lease_term_months,
        type_apartment, type_basement, type_duplex, type_house, type_townhouse,
        availability_days 
    ]]

    prediction = model.predict(features)[0]

    st.success(f"**Estimated Fair Rent:** ${prediction:,.2f}")
