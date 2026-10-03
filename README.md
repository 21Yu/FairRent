# FairRent

FairRent is a full-stack rental market platform for discovering listings, exploring neighborhood pricing, and evaluating whether a rent is reasonable relative to market conditions. The project combines a MongoDB-backed listing catalog, a FastAPI backend, and a React + Vite frontend with map-based browsing and pricing intelligence.

## Live demo

[FairRent](https://fair-rent-five.vercel.app)
## What the app does

- Browse rental listings on an interactive map and sidebar view
- Filter results by price, listing type, bedrooms, bathrooms, and square footage
- View detailed property information and neighborhood context
- Get AI-assisted predicted rent values for individual listings
- Compare each listing against local cluster averages for pricing insight
- Register, log in, and manage saved listings with JWT authentication
- Support admin-level user management in the backend

## Tech stack

- Frontend: React, TypeScript, Vite, React Router, Leaflet, React-Leaflet
- Styling: Tailwind CSS
- Backend: Python, FastAPI, Uvicorn, Pydantic
- Database: MongoDB, Motor
- ML: pandas, NumPy, scikit-learn, XGBoost, joblib
- Auth: JWT, password hashing, OAuth2 password flow

## Repository structure

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
│   ├── .env
│   ├── README.md
│   ├── pytest.ini
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json
├── reports/
│   ├── plots/
│   └── *.txt
├── LICENSE
├── README.md
└── .github/
    └── workflows/
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB running locally or using a MongoDB Atlas connection string

## Backend setup

1. Change into the backend folder:

```bash
cd backend
```

2. Create a `.env` file in the `backend/` directory with values similar to:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=fairrent
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAILS=admin@example.com
```

`ADMIN_EMAILS` accepts a comma-separated list of user emails that should be promoted to admin access.

3. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

4. Install Python dependencies:

```bash
pip install -r requirements.txt
```

5. Run the API:

```bash
uvicorn app.main:app --reload
```

The FastAPI app will be available at:

- http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs

## Frontend setup

1. Open a new terminal session and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite app:

```bash
npm run dev
```

The frontend runs at:

- http://127.0.0.1:5173

## API overview

### Listing routes

- `GET /listings/` — fetch listings, with optional filters and map bounds
- `GET /listings/{id}` — fetch a specific listing by ID

### ML routes

- `GET /ml/predict?id=<listing_id>` — return the predicted rent for a listing
- `GET /ml/insights?id=<listing_id>` — return cluster-level pricing insights

### User routes

- `POST /users/register` — create a new account
- `POST /users/login` — authenticate and receive a JWT token
- `GET /users/me` — fetch the current logged-in user
- `PATCH /users/me` — update the signed-in user
- `POST /users/saved-listings` — save a listing
- `GET /users/saved-listings` — fetch saved listings for the current user
- `DELETE /users/saved-listings/{listing_id}` — remove a saved listing

### Admin routes

- `GET /users/admin/users` — list users, restricted to admin accounts
- `PATCH /users/admin/users/{user_id}` — edit user details as admin
- `DELETE /users/admin/users/{user_id}` — delete a user as admin

### Utility/testing routes

- `POST /test/reset-db` — reset the local database for testing

## Model performance

The project compares multiple learning models for rent prediction. The final model used in the app is the XGBoost implementation.

- Linear Regression: RMSE 725.26, MAE 401.00, R² 0.4008
- Gradient Boosting: RMSE 548.57, MAE 276.87, R² 0.6572
- Tuned Gradient Boosting: RMSE 506.04, MAE 235.51, R² 0.7083
- XGBoost (Final): RMSE 448.61, MAE 223.39, R² 0.7568

## Notes

- The frontend and backend are configured to work together through environment-based API settings.
- MongoDB stores listing records, user documents, and saved-listing state.
- The app is intended for rental-market research and evaluation, not a full production real-estate management platform.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
