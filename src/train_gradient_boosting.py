import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import os

# Load processed data
data = pd.read_csv("data/processed/rentfaster_clean.csv")

# Define features & target
features = [
    'beds', 'baths', 'sq_feet', 'furnishing', 'smoking',
    'cats', 'dogs', 'availability_days', 'type_apartment',
    'type_basement', 'type_duplex', 'type_house', 'type_townhouse',
    'lease_term_months', 'location_avg_price'
]
target = 'price'

X = data[features].copy()
y = data[target].copy()

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
)

# Initialize and train model
model = GradientBoostingRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=4,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate performance
y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("===== Gradient Boosting Model Evaluation =====")
print(f"RMSE: {rmse:.2f}")
print(f"MAE: {mae:.2f}")
print(f"R²: {r2:.4f}")

# Save model and report
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/gradient_boosting_model.pkl")

report_text = f"""
Gradient Boosting Regression Report
====================================
RMSE: {rmse:.2f}
MAE: {mae:.2f}
R²: {r2:.4f}

Model Parameters:
-----------------
n_estimators = 300
learning_rate = 0.05
max_depth = 4
random_state = 42
"""

os.makedirs("reports", exist_ok=True)
with open("reports/gradient_boosting_report.txt", "w", encoding="utf-8") as f:
    f.write(report_text)

print("\nModel and report saved successfully!")
