import panda as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# load data
data = pd.read_csv("data/processed/rentfaster_clean.csv")

# define features & target
features = [
    'beds', 'baths', 'sq_feet', 'furnishing', 'smoking',
    'cats', 'dogs', 'availability_days', 'type_apartment',
    'type_basement', 'type_duplex', 'type_house', 'type_townhouse',
    'lease_term_months', 'location_avg_price'
]
target = 'price'

X = data[features].copy();
y = data[target].copy();

# split the data
X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
)

# base model
xgb_model = XGBRegressor(random_state=42, objective='reg:squarederror')

# hyperparameter search space
param_dist = {
        'n_estimators': randint(200, 600),
        'learning_rate': uniform(0.01, 0.15),
        'max_depth': randint(3, 8),
        'subsample': uniform(0.7, 0.3),
        'colsample_bytree': uniform(0.7, 0.3)
}

search = RandomizedSearchCV(
        xgb_model,
        param_distribution=params_dist,
        n_iter=50,
        cv=3,
        scoring='r2',
        n_jobs=-1,
        random_state=42
)


