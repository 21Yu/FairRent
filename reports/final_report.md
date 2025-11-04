# 🧾 Final Project Report: ML Rent Predictor

## Project Summary
The ML Rent Predictor aims to forecast rental prices using regression models. The project walks through the full ML pipeline: data cleaning, transformation, model training, tuning, and evaluation.

## Key Findings
- The dataset required extensive preprocessing before modeling could begin.
- XGBoost achieved the best balance of accuracy and generalization.
- Baths, basement type, and location average price are strong predictors.
- The model performs best on mid-range rents, with higher error at luxury-level rents.

## Model Performance

| Model | RMSE | MAE | R² |
|:------|:------|:------|:------|
| Linear Regression | 511.77 | 318.15 | 0.5838 |
| Gradient Boosting | 433.38 | 268.62 | 0.7015 |
| Gradient Boosting (Tuned) | 413.44 | 254.33 | 0.7284 |
| XGBoost (Final) | **393.03** | **248.13** | **0.7441** |

## Data Cleaning Summary
- Dropped: `rentfaster_id`, `address`, `link`
- Encoded categorical features using one-hot and mapping methods.
- Created derived features like `location_avg_price`.
- Handled NaN and missing values carefully.
- Reduced dataset size from 25,772 to 13,581 rows after cleaning.

## Visual Insights
- **Feature Importance**: Baths, basement type, and location average price dominate.
- **Predicted vs Actual**: Strong correlation under $4,000, with higher variance beyond.

## Conclusion
This project highlights practical data science and ML workflow capabilities, from messy raw data to a deployable predictive system — a strong demonstration of applied machine learning for real estate analysis.
