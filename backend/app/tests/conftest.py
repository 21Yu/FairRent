import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.db.mongodb import get_database

@pytest_asyncio.fixture
async def client():
    # LifespanManager connects db.client during startup
    async with LifespanManager(app) as manager:
        async with AsyncClient(
            transport=ASGITransport(app=manager.app), 
            base_url="http://test"
        ) as ac:
            yield ac

@pytest_asyncio.fixture(autouse=True)
async def clean_database(client):
    """Wipe database collections after FastAPI app lifespan starts."""
    database = await get_database()
    await database["users"].delete_many({})
    yield