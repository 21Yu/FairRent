import numpy as np
import pandas as pd
import re
data = pd.read_csv("data/raw/rentfaster.csv")

# Drop irrelavant columns
data.drop(columns=['rentfaster_id', 'address', 'link', 'latitude', 'longitude'], inplace=True)

#handle duplicates
data.drop_duplicates(inplace=True)

# handle missing / nan
relevant_cols = ['city', 'province', 'lease_term', 'type', 'price', 'beds', 'baths', 
                 'sq_feet', 'furnishing', 'availability_date', 'smoking', 'cats', 'dogs']

data = data.dropna(subset=relevant_cols)

for col in relevant_cols:
    data = data[data[col].astype(str).str.strip() != '']

# convert True /False
data['cats'] = (data['cats'].astype(str).str.strip().str.upper().map({'TRUE': 1, 'FALSE': 0}))
data['dogs'] = (data['dogs'].astype(str).str.strip().str.upper().map({'TRUE': 1, 'FALSE': 0}))
data['smoking'] = (data['smoking'].astype(str).str.strip().str.upper().map({'NON-SMOKING': 0, 'SMOKE FREE BUILDING': 1}))
data['furnishing'] = (data['furnishing'].astype(str).str.strip().str.upper().map({'UNFURNISHED': 0, 'FURNISHED': 1, 'NEGOTIABLE': 2}))

#handle available date
ref_date = pd.Timestamp("2024-06-01")
def convert_availability(date_str):
    date_str = str(date_str).strip().lower()

    if date_str == 'immediate':
        return 0
    elif date_str in ['no vacancy', 'negotiable', 'call for availability']:
        return 365
    else:
        try:
            dt = pd.to_datetime(f"{date_str} 2024", format="%B %d %Y")
            days_until = (dt - ref_date).days
            return max(days_until, 0)
        except:
            return 365

data['availability_days'] = data['availability_date'].apply(convert_availability) 
data.drop(columns=['availability_date'], inplace=True)

#handle baths
data['baths'] = data['baths'].astype(str).str.strip().str.lower()
data['baths'] = data['baths'].replace({'none': np.nan})
data['baths'] = data['baths'].astype(float)

#handle price
data['price'] = data['price'].astype(float)
#handle sq feet
def clean_sq_feet(value):
    
    text = str(value).lower().replace(',', '').replace('+', '')

    match = re.search(r'(\d+(\.\d+)?)', text)
    if match:
        return float(match.group(1))
    else:
        return None

data['sq_feet'] = data['sq_feet'].apply(clean_sq_feet)

#handle beds
data['beds'] = data['beds'].astype(str).str.strip().str.lower()
data['beds'] = data['beds'].replace({'studio': '0'})
data['beds'] = data['beds'].str.extract('(\d+)')
data['beds'] = data['beds'].astype(float)

#handle type
data['type'] = data['type'].astype(str).str.strip().str.lower()
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
#handle lease term
data['lease_term'] = data['lease_term'].astype(str).str.strip().str.lower()
data['lease_term_months'] = data['lease_term'].map({
    'long term': 12,
    'short term': 3,
    'negotiable': 6,
    '12 months': 12,
    '6 months': 6,
    'months': 12
})
data.drop(columns=['lease_term'], inplace=True)

#handle home and province
data['location'] = data['city'].str.strip().str.lower() + ', ' + data['province'].str.strip().str.lower()
location_avg_rent = data.groupby('location')['price'].mean()
data['location_avg_price'] = data['location'].map(location_avg_rent)

data.drop(columns=['city', 'province'], inplace=True)

# print("\nColumns with missing values:")
# print(data.isna().sum()[data.isna().sum() > 0])

data.dropna(inplace=True)
data.to_csv("data/processed/rentfaster_clean.csv", index=False)
