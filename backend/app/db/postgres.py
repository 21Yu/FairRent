from __future__ import annotations

import json
from types import SimpleNamespace
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

SCHEMA_STATEMENTS = (
    """CREATE EXTENSION IF NOT EXISTS pgcrypto""",
    """CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        user_name TEXT NOT NULL,
        saved_listings TEXT[] NOT NULL DEFAULT '{}'
    )""",
    """CREATE TABLE IF NOT EXISTS listings (
        id TEXT PRIMARY KEY, price DOUBLE PRECISION, type TEXT, province TEXT,
        beds DOUBLE PRECISION, baths DOUBLE PRECISION, sq_feet DOUBLE PRECISION,
        latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, geo_cluster INTEGER,
        data JSONB NOT NULL DEFAULT '{}'::jsonb
    )""",
    "CREATE INDEX IF NOT EXISTS listings_price_idx ON listings (price)",
    "CREATE INDEX IF NOT EXISTS listings_type_idx ON listings (type)",
    "CREATE INDEX IF NOT EXISTS listings_geo_cluster_idx ON listings (geo_cluster)",
)


def _user(row) -> dict[str, Any] | None:
    if row is None:
        return None
    result = dict(row._mapping)
    result["_id"] = str(result.pop("id"))
    return result


def _listing(row) -> dict[str, Any] | None:
    if row is None:
        return None
    values = row._mapping
    raw_data = values["data"] or {}
    result = json.loads(raw_data) if isinstance(raw_data, str) else dict(raw_data)
    result["_id"] = values["id"]
    for key in ("price", "type", "province", "beds", "baths", "sq_feet", "latitude", "longitude", "geo_cluster"):
        if values[key] is not None:
            result[key] = values[key]
    return result


class _Cursor:
    def __init__(self, loader):
        self.loader = loader
        self.amount = None

    def limit(self, amount: int) -> _Cursor:
        self.amount = amount
        return self

    async def to_list(self, length: int | None = None):
        rows = await self.loader()
        amount = self.amount if self.amount is not None else length
        return rows if amount is None else rows[:amount]


class _Collection:
    def __init__(self, database: PostgresDatabase, name: str):
        self.database = database
        self.name = name

    async def find_one(self, query, projection=None):
        if self.name == "users":
            if "email" in query:
                row = await self.database.fetchrow(
                    "SELECT * FROM users WHERE email = :email",
                    {"email": query["email"]},
                )
            else:
                row = await self.database.fetchrow(
                    "SELECT * FROM users WHERE id = CAST(:user_id AS uuid)",
                    {"user_id": query.get("_id")},
                )
            result = _user(row)
        else:
            listing_id = query.get("_id")
            result = await self.database.get_listing(listing_id) if isinstance(listing_id, str) else None
        if result and projection:
            for key, include in projection.items():
                if include == 0:
                    result.pop(key, None)
        return result

    async def insert_one(self, document):
        if self.name == "users":
            row = await self.database.fetchrow(
                """INSERT INTO users (email, hashed_password, user_name, saved_listings)
                   VALUES (:email, :hashed_password, :user_name, :saved_listings)
                   RETURNING id""",
                {
                    "email": document["email"],
                    "hashed_password": document["hashed_password"],
                    "user_name": document["user_name"],
                    "saved_listings": document.get("saved_listings", []),
                },
            )
            return SimpleNamespace(inserted_id=str(row._mapping["id"]))
        await self.database.upsert_listing(document)
        return SimpleNamespace(inserted_id=document["_id"])

    async def insert_many(self, documents):
        for document in documents:
            await self.insert_one(document)

    async def update_one(self, query, changes):
        user = await self.find_one(query)
        if not user:
            return SimpleNamespace(modified_count=0)
        identifier = user["_id"]
        set_values = dict(changes.get("$set", {}))
        if "$addToSet" in changes:
            values = await self.database.user_saved_listings(identifier)
            value = changes["$addToSet"]["saved_listings"]
            if value not in values:
                values.append(value)
            set_values["saved_listings"] = values
        if "$pull" in changes:
            values = [value for value in await self.database.user_saved_listings(identifier) if value != changes["$pull"]["saved_listings"]]
            set_values["saved_listings"] = values
        assignments = []
        params = {"user_id": identifier}
        for key, value in set_values.items():
            assignments.append(f"{key} = :{key}")
            params[key] = value
        if assignments:
            await self.database.execute(
                f"UPDATE users SET {', '.join(assignments)} WHERE id = CAST(:user_id AS uuid)",
                params,
            )
        return SimpleNamespace(modified_count=1)

    async def delete_one(self, query):
        result = await self.database.execute(
            "DELETE FROM users WHERE id = CAST(:user_id AS uuid)",
            {"user_id": query.get("_id")},
        )
        return SimpleNamespace(deleted_count=result.rowcount)

    async def delete_many(self, query):
        result = await self.database.execute(text(f"DELETE FROM {self.name}"), {})
        return SimpleNamespace(deleted_count=result.rowcount)

    async def count_documents(self, query):
        row = await self.database.fetchrow(text(f"SELECT COUNT(*) AS count FROM {self.name}"), {})
        return row._mapping["count"]

    def find(self, query, projection=None):
        async def load_rows():
            if self.name == "users":
                rows = await self.database.fetchall("SELECT * FROM users ORDER BY email", {})
                values = [_user(row) for row in rows]
            else:
                values = await self.database.query_listings(query)
            if projection:
                for value in values:
                    for key, include in projection.items():
                        if include == 0:
                            value.pop(key, None)
            return values

        return _Cursor(load_rows)


class PostgresDatabase:
    def __init__(self):
        self.engine: AsyncEngine | None = None
        self.session_factory: async_sessionmaker[AsyncSession] | None = None
        self.users = _Collection(self, "users")
        self.listings = _Collection(self, "listings")

    def __getitem__(self, table):
        return getattr(self, table)

    async def connect(self):
        parsed_url = urlsplit(settings.POSTGRES_URL)
        query = dict(parse_qsl(parsed_url.query))
        sslmode = query.pop("sslmode", None)
        query.pop("channel_binding", None)
        scheme = parsed_url.scheme
        if scheme in {"postgres", "postgresql"}:
            scheme = "postgresql+asyncpg"
        engine_url = urlunsplit(parsed_url._replace(scheme=scheme, query=urlencode(query)))
        connect_args = {}
        if sslmode == "require":
            connect_args["ssl"] = True
        self.engine = create_async_engine(engine_url, connect_args=connect_args, pool_pre_ping=True)
        self.session_factory = async_sessionmaker(self.engine, expire_on_commit=False)
        async with self.engine.begin() as connection:
            for statement in SCHEMA_STATEMENTS:
                await connection.exec_driver_sql(statement)

    async def close(self):
        if self.engine:
            await self.engine.dispose()
            self.engine = None
            self.session_factory = None

    async def fetchrow(self, statement, params):
        async with self.session_factory.begin() as session:
            result = await session.execute(text(statement) if isinstance(statement, str) else statement, params)
            return result.first()

    async def fetchall(self, statement, params):
        async with self.session_factory.begin() as session:
            result = await session.execute(text(statement) if isinstance(statement, str) else statement, params)
            return result.fetchall()

    async def execute(self, statement, params):
        async with self.session_factory.begin() as session:
            return await session.execute(text(statement) if isinstance(statement, str) else statement, params)

    async def get_listing(self, listing_id):
        if not listing_id:
            return None
        row = await self.fetchrow("SELECT * FROM listings WHERE id = :listing_id", {"listing_id": listing_id})
        return _listing(row)

    async def upsert_listing(self, document):
        data = dict(document)
        listing_id = str(data.pop("_id", data.pop("id", "")))
        columns = ("price", "type", "province", "beds", "baths", "sq_feet", "latitude", "longitude", "geo_cluster")
        params = {"listing_id": listing_id, "data": json.dumps(data, default=str)}
        for key in columns:
            params[key] = data.get(key)
        await self.execute(
            """INSERT INTO listings (id, price, type, province, beds, baths, sq_feet, latitude, longitude, geo_cluster, data)
               VALUES (:listing_id, :price, :type, :province, :beds, :baths, :sq_feet, :latitude, :longitude, :geo_cluster, CAST(:data AS jsonb))
               ON CONFLICT (id) DO UPDATE SET price=EXCLUDED.price, type=EXCLUDED.type, province=EXCLUDED.province,
               beds=EXCLUDED.beds, baths=EXCLUDED.baths, sq_feet=EXCLUDED.sq_feet, latitude=EXCLUDED.latitude,
               longitude=EXCLUDED.longitude, geo_cluster=EXCLUDED.geo_cluster, data=EXCLUDED.data""",
            params,
        )

    async def query_listings(self, query):
        conditions, params = [], {}
        listing_ids = query.get("_id", {}).get("$in")
        if listing_ids is not None:
            conditions.append("id = ANY(CAST(:listing_ids AS text[]))")
            params["listing_ids"] = listing_ids
        for column in ("type", "province"):
            if query.get(column) is not None:
                conditions.append(f"{column} = :{column}")
                params[column] = query[column]
        for column in ("price", "beds", "baths", "sq_feet"):
            condition = query.get(column)
            if isinstance(condition, dict) and "$lte" in condition:
                conditions.append(f"{column} <= :{column}")
                params[column] = condition["$lte"]
        bounds = query.get("location", {}).get("$geoWithin", {}).get("$box")
        if bounds:
            (west, south), (east, north) = bounds
            conditions.extend(("longitude >= :west", "longitude <= :east", "latitude >= :south", "latitude <= :north"))
            params.update({"west": west, "east": east, "south": south, "north": north})
        where = f" WHERE {' AND '.join(conditions)}" if conditions else ""
        rows = await self.fetchall(f"SELECT * FROM listings{where} ORDER BY id LIMIT 100", params)
        return [_listing(row) for row in rows]

    async def user_saved_listings(self, user_id):
        row = await self.fetchrow(
            "SELECT saved_listings FROM users WHERE id = CAST(:user_id AS uuid)",
            {"user_id": user_id},
        )
        return list(row._mapping["saved_listings"] or [])

    async def cluster_stats(self, cluster_id):
        return await self.fetchrow(
            "SELECT AVG(price) AS avg_price, COUNT(*) AS count FROM listings WHERE geo_cluster = :cluster_id",
            {"cluster_id": cluster_id},
        )


db = PostgresDatabase()


async def get_database():
    if db.engine is None:
        raise RuntimeError("Database engine is not initialized.")
    return db
