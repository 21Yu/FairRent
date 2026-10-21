import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.db.mongodb import get_database
from app.core.config import settings

@pytest_asyncio.fixture
async def client():
    original_database_name = settings.DATABASE_NAME
    settings.DATABASE_NAME = f"{original_database_name}_test"
    # LifespanManager connects db.client during startup
    try:
        async with LifespanManager(app) as manager:
            async with AsyncClient(
                transport=ASGITransport(app=manager.app),
                base_url="http://test"
            ) as ac:
                yield ac
    finally:
        settings.DATABASE_NAME = original_database_name

@pytest_asyncio.fixture(autouse=True)
async def clean_database(client):
    """Wipe database collections after FastAPI app lifespan starts."""
    database = await get_database()
    await database["users"].delete_many({})
    await database["listings"].delete_many({})
    yield