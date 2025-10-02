import pandas as pd
data = pd.read_csv("data/raw/rentfaster.csv")

# Drop irrelavant columns
data.drop(columns=['rentfaster_id', 'address', 'link'], inplace=True)

# extract numerical part
data['beds'] = data['beds'].astype(str).str.extract('(\d+)').astype(float)

# convert True /False
data['cats'] = data['cats'].map({'TRUE': 1, 'FALSE': 0})
data['dogs'] = data['dogs'].map({'TRUE': 1, 'FALSE': 0})
data['smoking'] = data['smoking'].map({'Non-Smoking': 0, 'Smoking': 1})
data['furnishing'] = data['furnishing'].map({'Unfurnished': 0, 'Furnished': 1, 'Negotiable': 2})

#handle available date
data['availability_date'] = data['availability_date'].replace('Immediate', '2024-06-01')
data['availability_date'] = pd.to_datetime(data['availability_date'], errors='coerce')
#handle duplicates
data.drop_duplicates(inplace=True)

# handle missing values
data.dropna(subset=['price', 'beds', 'baths'], inplace=True)
data.to_csv("data/processed/rentfaster_clean.csv", index=False)
