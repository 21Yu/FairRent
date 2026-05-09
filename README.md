# FairRent 2.0

## Overview
**FairRent** is a full-stack web application that helps users navigate the rental market using **Machine Learning**. By comparing real-time listings with predicted market values, the app identifies whether a rental price is **"Fair," "Overpriced," or a "Deal."**

## Live Demo
[FairRent Live Demo](https://fair-rent-five.vercel.app)

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Mapping** | Leaflet, React-Leaflet |
| **Backend** | Python, FastAPI, Uvicorn |
| **ML/Data** | XGBoost, Scikit-learn, Pandas, Joblib, NumPy |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## System Architecture

The project follows a modern **client-server architecture**.

### FastAPI Backend
- Serves rental data from a processed CSV
- Handles complex filtering logic
- Hosts the inference endpoint for the XGBoost model

### React Frontend
- Responsive, map-heavy dashboard
- Synchronizes map bounds with the rental listings sidebar

### ML Pipeline & Feature Engineering
Automated scripts handle:
- Cleaning raw rental data
- Performing feature engineering
- Exporting the trained model for API inference

## Key Features

### Interactive Map Discovery
- **Leaflet Integration** for geographic rental visualization
- **Dynamic Bounds Filtering** updates listings based on visible map area

### Rental Cards Display
- Bedrooms
- Bathrooms
- Square footage
- Pricing

### Advanced Filtering
Users can filter listings in real time by:
- Maximum price
- Property type
  - House
  - Apartment
  - Basement
  - etc.
- Bedrooms
- Bathrooms
- Maximum square footage

### AI Price Prediction
On the details page, users can click **Predict Price** to:

1. Call the FastAPI `/predict` endpoint
2. Compare:
   - Actual listing price
   - Predicted market value
3. Receive a visual indicator showing whether the listing is:
   - Fairly priced
   - Overpriced
   - A good deal

## Data & Machine Learning

### ML Pipeline Stages

#### 1. Data Ingestion
- Load raw rental datasets

#### 2. Preprocessing
- Handle missing (`NaN`) values
- Mixed-type handling
- Remove empty strings and duplicates
- Encode smoking policies
- Normalize lease terms

#### 3. Feature Engineering
- Calculate city-wide average rental prices
- Add regional pricing context
- Create new features from existing data
- K-Means clustering
- One-hot encoding

#### 4. Model Selection
Evaluated multiple regression models:
- Linear Regression
- Gradient Boosting
- XGBoost Regressor

## Model Performance

| Model | RMSE | MAE | R² |
| :--- | :---: | :---: | :---: |
| Linear Regression | 725.26 | 401.00 | 0.4008 |
| Gradient Boosting | 548.57 | 276.87 | 0.6572 |
| Tuned Gradient Boosting | 506.04 | 235.51 | 0.7083 |
| XGBoost (Final) | 511.99 | 230.43 | 0.7014 |

## Getting Started

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```