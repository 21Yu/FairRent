import numpy as np
import pandas as pd
import re

data = pd.read_csv("data/raw/rentfaster.csv")

# for debug
# print(data.isna().sum())
# print(data.dtypes)
# print(data.shape)      
# print(data["type"].value_counts())
# print(data["smoking"].unique())
# print(data.describe())
# print(data["lease_term_months"].value_counts(dropna=False))
# print(data[data["beds"].isna()])
# print(data[data.duplicated()])
# print(data[data["province"] == ''])
# data.to_csv("data/processed/rentfaster_clean2.csv", index=False)

# handle link
data.drop(columns='link', inplace=True)
data.drop_duplicates(inplace=True)  

# handle id
data['rentfaster_id'] = data['rentfaster_id'].astype('string').str.strip()
data.drop_duplicates(subset="rentfaster_id", inplace=True)

# handle city and province
data['city'] = data['city'].astype('string').str.strip()
data['province'] = data['province'].astype('string').str.strip()
data['location'] = data['city'] + ', ' + data['province']
location_freq = data["location"].value_counts()
data["location_freq"] = data["location"].map(location_freq).astype(float)
data.drop(columns='location', inplace=True)

# handle address
data['address'] = data['address'].astype('string').str.strip()

# handle latitude and longitude
data['latitude'] = data['latitude'].astype(float)
data['longitude'] = data['longitude'].astype(float)

#handle lease term
data['lease_term'] = data['lease_term'].astype('string').str.strip().str.lower()
data['lease_term'] = data['lease_term'].map({
    'long term': 12,
    'short term': 3,
    'negotiable': 6,
    '12 months': 12,
    '6 months': 6,
    'months': 6
}).fillna(6).astype(int)

#handle type
data['type'] = data['type'].astype('string').str.strip().str.lower()
data['type'] = data['type'].replace({
    'condo unit': 'apartment',
    'main floor': 'house',
    'room for rent': 'apartment',
    'loft': 'apartment',
    'mobile': 'house',
    'vacation home': 'house',
    'acreage': 'house',
    'office space': 'other',
    'storage': 'other',
    'parking spot': 'other'
})

# handle price
data['price'] = data['price'].astype(float)

# handle beds
data['beds'] = data['beds'].astype('string').str.strip().str.lower()
data['beds'] = data['beds'].replace({'studio': '0', 'none beds': np.nan})
data['beds'] = data['beds'].str.extract('(\d+)')
data['beds'] = pd.to_numeric(data['beds'])
data['beds'] = data['beds'].fillna(data['beds'].median()).astype(float)

# handle baths
data['baths'] = data['baths'].astype('string').str.strip().str.lower()
data['baths'] = data['baths'].replace({'none': np.nan})
data['baths'] = pd.to_numeric(data['baths'])
data['baths'] = data['baths'].fillna(data['baths'].median()).astype(float)

# handle sq feet
data['sq_feet'] = (
    data['sq_feet']
    .astype('string')
    .str.lower()
    .str.replace(',', '', regex=False)
    .str.replace('+', '', regex=False)
    .str.extract(r'(\d+\.?\d*)')[0]
)
data['sq_feet'] = pd.to_numeric(data['sq_feet'])
data.loc[data['sq_feet'] == 0, 'sq_feet'] = np.nan
data['sq_feet'] = data['sq_feet'].fillna(data['sq_feet'].median()).astype(float)

# price per sq feet
data['price_sq_ft'] = (data['price'] / data['sq_feet']).round(2).astype(float)

# handle furnishing
data['furnishing'] = (
    data['furnishing']
    .astype('string')
    .str.strip()
    .str.lower()
    .map({
        'unfurnished, negotiable': False,
        'unfurnished': False,
        'negotiable': False, 
        'furnished': True
    }).astype(bool)
)

# handle available date
ref_date = pd.Timestamp("2024-06-01")

def convert_availability(date_str):
    if pd.isna(date_str):
        return 365

    date_str = str(date_str).strip().lower()

    if date_str == 'immediate':
        return 0

    if date_str in ['no vacancy', 'negotiable', 'call for availability']:
        return 90

    try:
        dt = pd.to_datetime(f"{date_str} 2024", format="%B %d %Y")
        return max((dt - ref_date).days, 0)
    except:
        return 365

data['availability_days'] = data['availability_date'].apply(convert_availability).astype(int)
data.drop(columns=['availability_date'], inplace=True)

# handle smoking
data['smoking'] = (
    data['smoking']
    .astype('string')
    .str.strip()
    .str.lower()
    .map({
        'non-smoking': False,
        'smoking allowed': True,
        'negotiable': False,
        'smoke free building': False
    })
)
data['smoking'] = data['smoking'].fillna(False).astype(bool)

# handle cats
data['cats'] = data['cats'].fillna(False).astype(bool)

# handle dogs
data['dogs'] = data['dogs'].fillna(False).astype(bool)

data.dropna(inplace=True)
data.drop_duplicates(inplace=True)  

print(data.dtypes)
data.to_csv("data/processed/rentfaster_listing.csv", index=False)