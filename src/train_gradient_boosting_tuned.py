import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from scipy.stats import randint, uniform
import joblib
import os

# 1️⃣ Load data
data = pd.read_csv("data/processed/rentfaster_clean.csv")

# 2️⃣ Define features and target
features = [
    'beds', 'baths', 'sq_feet', 'furnishing', 'smoking',
    'cats', 'dogs', 'availability_days', 'type_apartment',
    'type_basement', 'type_duplex', 'type_house', 'type_townhouse',
    'lease_term_months', 'location_avg_price'
]
target = 'price'

X = data[features]
y = data[target]

# 3️⃣ Split into train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5️⃣ Define base model
base_model = GradientBoostingRegressor(random_state=42)

# 6️⃣ Define hyperparameter search space
param_dist = {
    'n_estimators': randint(100, 500),
    'learning_rate': uniform(0.03, 0.2),
    'max_depth': randint(2, 6),
    'subsample': uniform(0.8, 0.2)
}

# 7️⃣ Randomized search for best hyperparameters
search = RandomizedSearchCV(
    estimator=base_model,
    param_distributions=param_dist,
    n_iter=50,
    cv=3,
    scoring='r2',
    n_jobs=-1,
    random_state=42,
    verbose=0
)

search.fit(X_train, y_train)

# 8️⃣ Evaluate on test set
best_model = search.best_estimator_
y_pred = best_model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# 9️⃣ Feature importance
importance_df = pd.DataFrame({
    'Feature': features,
    'Importance': best_model.feature_importances_
}).sort_values(by='Importance', ascending=False)

# Create output directories
os.makedirs("models", exist_ok=True)
os.makedirs("reports", exist_ok=True)

# 11️⃣ Save model 
joblib.dump(best_model, "models/gradient_boosting_tuned.pkl")

# 12️⃣ Create formatted report text
report_text = f"""
==========================
Tuned Gradient Boosting Report
==========================

Best Parameters:
{search.best_params_}

Best Cross-Validation R²: {search.best_score_:.4f}

===== Test Set Performance =====
RMSE: {rmse:.2f}
MAE: {mae:.2f}
R²: {r2:.4f}

===== Feature Importances =====
{importance_df.to_string(index=False)}

Model and scaler saved to 'models/' directory.
"""

# 13️⃣ Save report to file
report_path = "reports/gradient_boosting_tuned.txt"
with open(report_path, "w", encoding="utf-8") as f:
    f.write(report_text)

print(f"Report saved to: {report_path}")
