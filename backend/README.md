# FairRent Backend

This directory contains the Python/FastAPI backend for the FairRent application. It exposes the listing, user, and ML APIs that support the frontend experience.

## Local setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in this folder:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=fairrent
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAILS=admin@example.com
```

Then start the API:

```bash
uvicorn app.main:app --reload
```

## API testing with curl

### Reset the database

```bash
curl -X POST http://127.0.0.1:8000/test/reset-db
```

### Register a user

```bash
curl -X POST http://127.0.0.1:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123!",
    "user_name": "Test User"
  }'
```

### Log in

```bash
curl -X POST http://127.0.0.1:8000/users/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser@example.com&password=Password123!"
```

This returns a JSON payload containing the `access_token` field.

### Get the current user profile

```bash
curl -X GET http://127.0.0.1:8000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Test an invalid login

```bash
curl -i -X POST http://127.0.0.1:8000/users/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser@example.com&password=wrongpassword"
```

### Test /me without a token

```bash
curl -i -X GET http://127.0.0.1:8000/users/me
```

This should return a `401 Unauthorized` response.

## Main routes

- `GET /listings/`
- `GET /listings/{id}`
- `GET /ml/predict?id=<listing_id>`
- `GET /ml/insights?id=<listing_id>`
- `POST /users/register`
- `POST /users/login`
- `GET /users/me`
- `POST /users/saved-listings`
- `GET /users/saved-listings`
- `DELETE /users/saved-listings/{listing_id}`

## Swagger docs

After starting the backend, open the OpenAPI docs here:

- http://127.0.0.1:8000/docs
