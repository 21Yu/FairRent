import numpy as np
import pandas as pd
import re

data = pd.read_csv("data/raw/rentfaster.csv")

data.drop(columns='link', inplace=True)

data.drop_duplicates(inplace=True)  
data.drop_duplicates(subset="rentfaster_id", inplace=True)

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

# handle city and province
data['location'] = data['city'].astype('string').str.strip().str.lower() + ', ' + data['province'].astype('string').str.strip().str.lower()
location_freq = data["location"].value_counts()
data["location_freq"] = data["location"].map(location_freq)
data.drop(columns='location', inplace=True)

#handle lease term
data['lease_term'] = data['lease_term'].astype('string').str.strip().str.lower()
data['lease_term_months'] = data['lease_term'].map({
    'long term': 12,
    'short term': 3,
    'negotiable': 6,
    '12 months': 12,
    '6 months': 6,
    'months': 6
}).fillna(6)
data.drop(columns=['lease_term'], inplace=True)

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
data = pd.get_dummies(data, columns=['type'], prefix='type', dtype=int)

# #handle price
data['price'] = data['price'].astype(float)

# #handle beds
data['beds'] = data['beds'].astype('string').str.strip().str.lower()
data['beds'] = data['beds'].replace({'studio': '0', 'none beds': np.nan})
data['beds'] = data['beds'].str.extract('(\d+)')
data['beds'] = pd.to_numeric(data['beds'])
data['beds'] = data['beds'].fillna(data['beds'].median())

# #handle baths
data['baths'] = data['baths'].astype('string').str.strip().str.lower()
data['baths'] = data['baths'].replace({'none': np.nan})
data['baths'] = pd.to_numeric(data['baths'])
data['baths'] = data['baths'].fillna(data['baths'].median())

#handle sq feet
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

data['sq_feet'] = data['sq_feet'].fillna(data['sq_feet'].median())

# handle furnishing
data['furnishing'] = data['furnishing'].astype('string').str.strip().str.lower()
data['furnishing'] = data['furnishing'].replace({'unfurnished, negotiable': 'unfurnished'})
data = pd.get_dummies(data, columns=['furnishing'], prefix='furnishing', dtype=int)

# #handle available date
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

data['availability_days'] = data['availability_date'].apply(convert_availability)
data.drop(columns=['availability_date'], inplace=True)

# handle smoking
data['smoking'] = (
    data['smoking']
    .astype('string')
    .str.strip()
    .str.lower()
    .map({
        'non-smoking': 0,
        'smoking allowed': 1,
        'negotiable': 0,
        'smoke free building': 0
    })
)
data['smoking'] = data['smoking'].fillna(0).astype(int)

# handle cats
data['cats'] = data['cats'].map({True: 1, False: 0}).fillna(0).astype(int)

# handle dogs
data['dogs'] = data['dogs'].map({True: 1, False: 0}).fillna(0).astype(int)

data.dropna(inplace=True)
data.drop_duplicates(inplace=True)  

print(data.dtypes)
data.to_csv("data/processed/rentfaster_listing.csv", index=False)