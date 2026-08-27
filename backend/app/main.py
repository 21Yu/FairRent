from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.services.data_loader import load_artifacts
from app.api import rentals, ml

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load heavy datasets and ML models during app startup
    load_artifacts()
    yield

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
app.include_router(rentals.router)
app.include_router(ml.router)

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to the FairRent API"}

@app.api_route("/health", methods=["HEAD"], tags=["Health"])
def head_health_check():
    return Response(status_code=200)