import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from scipy.stats import randint, uniform
import joblib
import os
import matplotlib.pyplot as plt

# load data
data = pd.read_csv("data/processed/rentfaster_clean.csv")

# define features & target
features = [
    'beds', 'baths', 'sq_feet', 'furnishing', 'smoking',
    'cats', 'dogs', 'location_avg_price', 'lease_term_months',
    'type_apartment', 'type_basement', 'type_duplex', 'type_house', 'type_townhouse',
    'availability_days'
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

# Randomized search for best hyperparameters
search = RandomizedSearchCV(
        xgb_model,
        param_distributions=param_dist,
        n_iter=50,
        cv=3,
        scoring='r2',
        n_jobs=-1,
        random_state=42
)

search.fit(X_train, y_train)

# evaluate on test set
best_model = search.best_estimator_
y_pred = best_model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# feature importance 
importance_df = pd.DataFrame({
    'Feature': features,
    'Importance': best_model.feature_importances_
}).sort_values(by='Importance', ascending=False)

# create output directories
os.makedirs("models", exist_ok=True)
os.makedirs("reports", exist_ok=True)

#save model
joblib.dump(best_model, "models/xgb_boosting_tuned.pkl")

#Create formatted report text
report_text = f"""
===== RXGBoost Regression report ===== 

Best Parameters:
{search.best_params_}

Best Cross-Validation R²: {search.best_score_:.4f}

===== Test Set Performance =====
RMSE: {rmse:.2f}
MAE: {mae:.2f}
R²: {r2:.4f}

===== Feature Importances =====
{importance_df.to_string(index=False)}

"""

#save report to file 
report_path = "reports/xgb_boosting_tuned.txt"
with open(report_path, "w", encoding="utf-8") as f:
    f.write(report_text)

# save feature importance plot
plt.figure(figsize=(10,6))
plt.barh(importance_df['Feature'], importance_df['Importance'])
plt.xlabel('Importance')
plt.title('Feature Importances')
plt.gca().invert_yaxis()  # largest on top
os.makedirs("reports/plots", exist_ok=True)
plt.savefig("reports/plots/feature_importance_xqb.png", bbox_inches='tight')
plt.close()

# save predict actual plot
plt.figure(figsize=(6,6))
plt.scatter(y_test, y_pred, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel('Actual Rent')
plt.ylabel('Predicted Rent')
plt.title('Predicted vs Actual Rent')
plt.savefig("reports/plots/predicted_vs_actual_xqb.png", bbox_inches='tight')
plt.close()

print(f"Report saved to: {report_path}")
