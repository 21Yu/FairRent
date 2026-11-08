from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.data_loader import load_artifacts
from app.routes import ml, users, health, utils, listings
from app.db.postgres import db
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load heavy datasets and ML models during app startup
    load_artifacts()
    await db.connect()
    print("Connected to PostgreSQL!")
    yield
    # Shutdown: Close client connection cleanly
    await db.close()
    print("Closed PostgreSQL connection.")

app = FastAPI(title="FairRent API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://fair-rent-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount APIRouters
app.include_router(listings.router, prefix="/listings")
app.include_router(ml.router, prefix="/ml")
app.include_router(users.router, prefix="/users")
app.include_router(health.router, prefix="/health")
app.include_router(utils.router, prefix="/test")