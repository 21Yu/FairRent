import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os

st.set_page_config(page_title="FairRent Predictor", page_icon="🏠", layout="centered")

model_path="models/xgb_boost_tuned.pkl"
data_path="data/processed/rentfaster_clean.csv"

model=joblib.load(model_path)
data=pd.read_csv(data_path)

st.title("FairRent Prediction App")
st.write("Estimate a fair rental price based on your property details and location.")

# dynamic input
beds_min, beds_max = float(data["beds"].min()), float(data["beds"].max())
baths_min, baths_max = float(data["baths"].min()), float(data["baths"].max())
sq_min, sq_max = float(data["sq_feet"].min()), float(data["sq_feet"].max())
lease_min, lease_max = float(data["lease_term_months"].min()), float(data["lease_term_months"].max())
avail_min, avail_max = float(data["availability_days"].min()), float(data["availability_days"].max())

# city and province
provinces = sorted(data["province"].dropna().unique())
selected_province = st.selectbox("Select Province", provinces)

filter_cities = data.loc[data["province"] == selected_province, "city"].dropna().unique()
cities = sorted(filter_cities)
selected_city = st.selectbox("Select City", cities)

# look up location average rent
match = data[(data["city"] == selected_city) & (data["province"] == selected_province)]
location_avg_price = match["location_avg_price"].iloc[0]

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
    
    smoking = st.radio("Smoking Allowed?", ["No", "Yes"])
    cats = st.radio("Cats Allowed?", ["No", "Yes"])
    dogs = st.radio("Dogs Allowed?", ["No", "Yes"])

    st.subheader("Property Type")
    property_type = st.selectbox(
        "Type of Property",
        ["Apartment", "Basement", "Duplex", "House", "Townhouse", "Other"]
    )

    submitted = st.form_submit_button("Predict Rent")


# predict rent
if submitted:
    def yn_to_num(x): return 1 if x == "Yes" else 0

    smoking = yn_to_num(smoking)
    cats = yn_to_num(cats)
    dogs = yn_to_num(dogs)

    # One-hot encode property type
    type_apartment = 1 if property_type == "Apartment" else 0
    type_basement = 1 if property_type == "Basement" else 0
    type_duplex = 1 if property_type == "Duplex" else 0
    type_house = 1 if property_type == "House" else 0
    type_townhouse = 1 if property_type == "Townhouse" else 0
    type_other = 1 if property_type == "Other" else 0

    features = [[
        beds, baths, sq_feet, furnishing, smoking,
        cats, dogs, availability_days,
        type_apartment, type_basement, type_duplex, type_house, type_townhouse, type_other,
        lease_term_months, location_avg_price    ]]

    prediction = model.predict(features)[0]

    st.success(f"**Estimated Fair Rent:** ${prediction:,.2f}")
    st.caption(f"Based on average rent of ${location_avg_price:,.0f} in {selected_city}, {selected_province}")
