import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import os

# Load cleaned data
data = pd.read_csv("data/processed/rentfaster_clean.csv")

# Define features and target
features = [
        'beds', 'baths', 'sq_feet', 'furnishing', 'smoking',
        'cats', 'dogs', 'availability_days', 'type_apartment',
        'type_basement', 'type_duplex', 'type_house', 'type_townhouse',
        'lease_term_months', 'location_avg_price']

target = 'price'

X = data[features].copy()
y = data[target].copy()

# Split data
X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Predict
y_pred = model.predict(X_test_scaled)

# Evaluate
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Feature coefficients
coef_df = pd.DataFrame({
    'Feature': features,
    'Coefficient': model.coef_
}).sort_values(by='Coefficient', ascending=False)

# save report
report_text = f"""
===== Linear Regression Model Report =====
RMSE: {rmse:.2f}
MAE: {mae:.2f}
R²: {r2:.4f}

Top Features:
{coef_df.to_string(index=False)}
"""

os.makedirs("reports", exist_ok=True)
with open("reports/linear_regression_report.txt", "w", encoding="utf-8") as f:
    f.write(report_text)

print("\nDetailed report saved to 'reports/linear_regression_report.txt'")

# Save model and scaler
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/linear_regression_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")
print("\nModel and scaler saved to 'models/' directory.")
