import numpy as np
import pandas as pd
import re

data = pd.read_csv("data/raw/rentfaster.csv")

data.drop(columns='link', inplace=True)

data.dropna(inplace=True)

data.drop_duplicates(subset=["rentfaster_id"], inplace=True)

#handle id
data['rentfaster_id'] = data['rentfaster_id'].astype(str)

# handle city
data['city'] = data['city'].astype(str)

# handle province
data['province'] = data['province'].astype(str)

# handle address
data['address'] = data['address'].astype(str)

# handle latitude
data['latitude'] = data['latitude'].astype(float)

# handle longitude
data['longitude'] = data['longitude'].astype(float)

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
})

#handle price
data['price'] = data['price'].astype(float)

#handle beds
data['beds'] = data['beds'].astype(str).str.strip().str.lower()
data['beds'] = data['beds'].replace({'studio': '0'})
data['beds'] = data['beds'].str.extract('(\d+)')
data['beds'] = data['beds'].astype(float)

#handle baths
data['baths'] = data['baths'].astype(str).str.strip().str.lower()
data['baths'] = data['baths'].replace({'none': np.nan})
data['baths'] = data['baths'].astype(float)

#handle sq feet
def clean_sq_feet(value):
    
    text = str(value).lower().replace(',', '').replace('+', '')

    match = re.search(r'(\d+(\.\d+)?)', text)
    if match:
        v = float(match.group(1))
        if v == 0:            # treat explicit 0 as missing
            return np.nan
        return v
    else:
        return np.nan

data['sq_feet'] = data['sq_feet'].apply(clean_sq_feet)

# handle furnishing
data['furnishing'] = data['furnishing'].replace({'Unfurnished, Negotiable': 'Unfurnished'})
data['furnishing'] = (data['furnishing'].astype(str).str.strip().str.upper().map({'UNFURNISHED': 0, 'FURNISHED': 1, 'NEGOTIABLE': 2}))

print(data["smoking"].value_counts())
# handle smoking
data['smoking'] = data['smoking'].replace({'Unfurnished, Negotiable': 'Unfurnished'})
data['smoking'] = (data['smoking'].astype(str).str.strip().str.upper().map({
    'NON-SMOKING': 0, 'SMOKE FREE BUILDING': 0, 'SMOKING ALLOWED': 1, 'NEGOTIABLE': 2}))

#handle lease term
data['lease_term'] = data['lease_term'].astype(str).str.strip().str.lower()
data['lease_term_months'] = data['lease_term'].map({
    'long term': 12,
    'short term': 3,
    'negotiable': 6,
    '12 months': 12,
    '6 months': 6,
    'months': 6
})
data.drop(columns=['lease_term'], inplace=True)






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



# handle cats
data['cats'] = (data['cats'].astype(str).str.strip().str.upper().map({'TRUE': 1, 'FALSE': 0}))

# handle dogs
data['dogs'] = (data['dogs'].astype(str).str.strip().str.upper().map({'TRUE': 1, 'FALSE': 0}))

data.dropna(inplace=True)
data.drop_duplicates(inplace=True)  

data.to_csv("data/processed/rentfaster_listing.csv", index=False)