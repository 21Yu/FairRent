# 🏡 ML Rent Predictor

## 📘 Overview
The **ML Rent Predictor** project uses **machine learning** to estimate rental prices based on property features. The model was trained on real estate data containing details such as property type, number of bedrooms and bathrooms, location, lease term, and other rental conditions.

The project demonstrates skills in **data preprocessing**, **feature engineering**, **model evaluation**, and **visualization** — culminating in a tuned **XGBoost regression model** with strong predictive performance.

---

## ⚙️ Project Workflow

### 1️⃣ Data Cleaning & Preprocessing
This was the most challenging and critical part of the project.
- **Dropped uninformative columns**: `rentfaster_id`, `address`, and `link` were removed.
- **Handled missing and NaN values** throughout the dataset.
- **Feature transformation & encoding**:
  - Created **average price per city/province** to capture local price context.
  - Applied **one-hot encoding** for `type` and other categorical features.
  - **Mapped lease terms** to numeric months.
  - **Encoded smoking policy**: `smoke free` → 1, `non smoking` → 0.
- Final cleaned dataset size reduced from **25,772 rows to 13,581 rows** after filtering invalid or incomplete entries.

---

## 🧠 Model Development

| Model | RMSE | MAE | R² | Notes |
|:------|:------|:------|:------|:------|
| **Linear Regression** | 511.77 | 318.15 | 0.5838 | Baseline model |
| **Gradient Boosting Regressor** | 433.38 | 268.62 | 0.7015 | Significant improvement |
| **Tuned Gradient Boosting** | 413.44 | 254.33 | 0.7284 | Better performance via RandomizedSearchCV |
| **XGBoost Regressor (Final)** | **393.03** | **248.13** | **0.7441** | Best performance |

---

## 📊 Results & Insights

### **Feature Importance**
The most influential features in the final XGBoost model:
1. **baths**
2. **type_basement**
3. **location_avg_price**

See: `reports/plots/feature_importance.png`

### **Predicted vs Actual**
- Predicted and actual rents are **very close** for prices **below $4,000**.
- Above $4,000, the model tends to **underestimate high-value rentals**.

See: `reports/plots/predicted_vs_actual.png`

---

## 🧩 Tools & Libraries
- Python 3.11
- Pandas, NumPy
- scikit-learn
- XGBoost
- Matplotlib, Seaborn
- Streamlit
- Joblib

---

## 🚀 How to Run
```bash
git clone https://github.com/yourusername/ml-rent-predictor.git
cd ml-rent-predictor
pip install -r requirements.txt
streamlit run app.py
```

---

## 📈 Key Learnings
- Gained hands-on experience in **real-world data cleaning** and **feature engineering**.
- Learned how to tune and interpret **machine learning regressors**.
- Improved model accuracy through experimentation and hyperparameter tuning.
- Created professional visualizations for **model explainability**.

---

## 📄 Report
See the full summary in `reports/final_report.md`.
