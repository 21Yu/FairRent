# FairRent

FairRent is a full-stack rental market platform that helps renters evaluate listings with data-driven pricing and map-based discovery. The app combines a MongoDB-backed listing catalogue, machine learning price prediction, and a React frontend that lets users browse, filter, compare, and save properties.

## Live Demo

[FairRent Live Demo](https://fair-rent-five.vercel.app)

## What’s included

- Interactive map-based rental browsing with dynamic map-bounds filtering
- Advanced search and filtering by price, type, beds, baths, and square footage
- Listing detail pages with property attributes and neighborhood context
- AI-assisted market pricing using a trained regression model
- Neighborhood comp insights based on geo-cluster averages
- User authentication with registration and login
- Saved listings with bookmark/unbookmark functionality
- Personal profile flow and saved listings dashboard

## Tech stack

| Layer | Stack |
| :--- | :--- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Mapping | Leaflet, React-Leaflet |
| Backend | Python, FastAPI, Uvicorn |
| Database | MongoDB, Motor |
| ML | scikit-learn, XGBoost, pandas, NumPy, joblib |
| Auth | JWT, Pydantic, password hashing |

## Project structure

```text
FairRent/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── ml/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── tests/
│   ├── requirements.txt
│   ├── README.md
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── reports/
├── README.md
└── LICENSE
```

## Core application features

### 1. Map-first rental discovery

The home page loads listings into a responsive map and sidebar experience. As the user pans or zooms the map, FairRent fetches filtered results based on visible map bounds, which keeps the listing inventory relevant to the current area.

### 2. Smart filtering

Users can refine listings by:

- maximum price
- property type
- bedrooms
- bathrooms
- square footage

The frontend passes those filters to the backend listing API, which applies MongoDB query constraints and returns matching records.

### 3. Detail page + pricing intelligence

Each property has a dedicated details view showing:

- address and location metadata
- price and unit stats
- listing characteristics (beds, baths, lease term, furnishing, pets, etc.)
- map preview
- AI market prediction and comp-based insights

The price prediction flow calls:

- `/ml/predict?id=<listing_id>`
- `/ml/insights?id=<listing_id>`

and then labels the listing as likely fair, good value, or overpriced based on the difference between the current rent and predicted market rate.

### 4. Authentication and saved listings

The app includes a complete user flow:

- register
- login
- fetch current profile
- save/remove listings
- view saved listings on a dedicated page

This is implemented via JWT-backed authentication and MongoDB user records.

### 5. ML and data pipeline

The backend loads and prepares rental data using a preprocessing and feature-engineering pipeline before inference. The project compares regression models, including linear regression, gradient boosting, and XGBoost, with the tuned XGBoost model being the final production choice.

## API overview

### Listing endpoints

- `GET /listings/` — fetch listings with filters and map bounds
- `GET /listings/{id}` — fetch one listing by ID

### ML endpoints

- `GET /ml/predict?id=<listing_id>` — return predicted rent for a listing
- `GET /ml/insights?id=<listing_id>` — return cluster-comp average and spread metrics

### User endpoints

- `POST /users/register` — create a new user
- `POST /users/login` — authenticate and receive JWT token
- `GET /users/me` — return current user profile
- `POST /users/saved-listings` — save a property
- `DELETE /users/saved-listings/{listing_id}` — remove a saved property
- `GET /users/saved-listings` — return all saved properties for the logged-in user

## Local setup

### 1. Backend

Create a `.env` file inside `backend/` with values like:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=fairrent
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Then run:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at:

- http://127.0.0.1:8000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will run with the Vite client at:

- http://127.0.0.1:5173

## Model performance

The project has evaluated multiple regression models for rental price prediction:

| Model | RMSE | MAE | R² |
| :--- | :---: | :---: | :---: |
| Linear Regression | 725.26 | 401.00 | 0.4008 |
| Gradient Boosting | 548.57 | 276.87 | 0.6572 |
| Tuned Gradient Boosting | 506.04 | 235.51 | 0.7083 |
| XGBoost (Final) | 448.61 | 223.39 | 0.7568 |

## Notes

- The frontend and backend are designed to work together through environment-based API configuration.
- MongoDB is used for storage of listing data, clustering metadata, and saved-user state.
- The app is intended for rental-market exploration and price-evaluation workflows rather than a full production listing management system.

## License

This project is distributed under the MIT license. See the repository license file for details.
