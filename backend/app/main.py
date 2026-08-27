from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.services.data_loader import load_artifacts
from app.api import rentals, ml, auth, health, users
from app.db.mongodb import db
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load heavy datasets and ML models during app startup
    load_artifacts()
    # Startup: Initialize MongoDB Async Client
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB!")
    yield
    # Shutdown: Close client connection cleanly
    db.client.close()
    print("Closed MongoDB connection.")

app = FastAPI(title="FairRent API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://fair-rent-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount APIRouters
app.include_router(rentals.router, prefix="/rentals", tags=["Rentals"])
app.include_router(ml.router, prefix="/ml", tags=["ML & Insights"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(users.router, prefix="/users", tags=["Users"])