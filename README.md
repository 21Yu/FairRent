# FairRent

FairRent is a full-stack rental market platform for discovering listings, exploring neighborhood pricing, and evaluating whether a rent is reasonable relative to market conditions. It combines a React + Vite frontend, a FastAPI backend, a Neon PostgreSQL database, and machine-learning models for rent prediction.

## Live deployment

- Frontend: [fair-rent-five.vercel.app](https://fair-rent-five.vercel.app/)
- Backend API: [fairrent-api.onrender.com](https://fairrent-api.onrender.com)
- API documentation: [fairrent-api.onrender.com/docs](https://fairrent-api.onrender.com/docs)
- Database: Neon PostgreSQL

## Features

- Browse rental listings on an interactive map and sidebar view
- Filter listings by price, type, bedrooms, bathrooms, and square footage
- View property details and neighborhood context
- Get predicted rent values and local cluster pricing insights
- Register, log in, and manage saved listings with JWT authentication
- Manage users through admin-only backend routes

## Tech stack

- Frontend: React 19, TypeScript, Vite, React Router, Leaflet, React-Leaflet
- Styling: Tailwind CSS
- Backend: Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy, asyncpg
- Database: PostgreSQL hosted on Neon
- ML: pandas, NumPy, scikit-learn, XGBoost, joblib
- Authentication: JWT, Argon2 password hashing, OAuth2 password flow
- Deployment: Vercel for the frontend and Render for the backend

## Repository structure

```text
FairRent/
├── backend/
│   ├── app/
│   │   ├── core/          # Configuration and security
│   │   ├── db/            # PostgreSQL connection and schema setup
│   │   ├── middleware/
│   │   ├── ml/            # Data, processing scripts, and trained models
│   │   ├── models/
│   │   ├── routes/        # Listing, user, ML, health, and utility APIs
│   │   ├── services/
│   │   └── tests/
│   ├── pytest.ini
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── reports/               # Model evaluation reports and plots
├── LICENSE
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- A PostgreSQL database, locally or through Neon

## Local development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
POSTGRES_URL=postgresql+asyncpg://USER:PASSWORD@HOST/DATABASE?sslmode=require
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAILS=admin@example.com
```

`ADMIN_EMAILS` accepts a comma-separated list of email addresses. The backend creates the required PostgreSQL tables and indexes when it starts.

Run the API:

```bash
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000` and its Swagger documentation at `http://127.0.0.1:8000/docs`.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the Vite development server:

```bash
npm run dev
```

The frontend is available at `http://127.0.0.1:5173`.

## Deployment configuration

### Vercel

The frontend is deployed from `frontend/`. Set this Vercel environment variable:

```env
VITE_API_BASE_URL=https://fairrent-api.onrender.com
```

The `frontend/vercel.json` rewrite supports client-side routes by serving `index.html` for unmatched paths.

### Render

Deploy the `backend/` directory as a Python web service. Configure the service to install `requirements.txt` and use this start command:

```bash
gunicorn -k uvicorn.workers.UvicornWorker app.main:app
```

Set these Render environment variables:

```env
POSTGRES_URL=<Neon connection string>
SECRET_KEY=<strong secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAILS=<comma-separated admin emails>
```

The API allows requests from the deployed Vercel frontend and from `http://localhost:5173` during local development.

### Neon

Create a Neon PostgreSQL database and use its connection string as `POSTGRES_URL`. The application uses the async PostgreSQL driver and initializes the `users` and `listings` tables during backend startup.

## API overview

### Listings and ML

- `GET /listings/` - Fetch listings with optional filters and map bounds
- `GET /listings/{id}` - Fetch a listing by ID
- `GET /ml/predict?id=<listing_id>` - Return a predicted rent
- `GET /ml/insights?id=<listing_id>` - Return local cluster pricing insights

### Users

- `POST /users/register` - Create an account
- `POST /users/login` - Authenticate and receive a JWT
- `POST /users/logout` - Log out the current session
- `GET /users/me` - Fetch the current user
- `PATCH /users/me` - Update the current user
- `POST /users/saved-listings` - Save a listing
- `GET /users/saved-listings` - Fetch saved listings
- `DELETE /users/saved-listings/{listing_id}` - Remove a saved listing

### Admin and utility routes

- `GET /users/admin/users` - List users for admins
- `PATCH /users/admin/users/{user_id}` - Update a user for admins
- `DELETE /users/admin/users/{user_id}` - Delete a user for admins
- `HEAD /health/` - Health check
- `POST /test/reset-db` - Reset database data for testing

## Model performance

The final model used by the application is the tuned XGBoost implementation.

| Model | RMSE | MAE | R² |
| --- | ---: | ---: | ---: |
| Linear Regression | 725.26 | 401.00 | 0.4008 |
| Gradient Boosting | 548.57 | 276.87 | 0.6572 |
| Tuned Gradient Boosting | 506.04 | 235.51 | 0.7083 |
| XGBoost (final) | 448.61 | 223.39 | 0.7568 |

## Testing and quality checks

From `frontend/`:

```bash
npm run lint
npm test
npm run build
```

From `backend/`:

```bash
pytest
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
