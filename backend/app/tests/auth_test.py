import pytest


async def register_user(client, *, email="test@example.com", password="securepassword123", user_name="Test User"):
    payload = {"email": email, "password": password, "user_name": user_name}
    response = await client.post("/users/register", json=payload)
    return response


async def login_user(client, *, email="test@example.com", password="securepassword123"):
    return await client.post(
        "/users/login",
        data={"username": email, "password": password},
    )


@pytest.mark.asyncio
async def test_auth(client):
    user_payload = {
        "email": "test@example.com",
        "password": "securepassword123",
        "user_name": "Test User"
    }

    reg_response = await client.post("/users/register", json=user_payload)
    assert reg_response.status_code in [200, 201]

    login_response = await login_user(client, email=user_payload["email"], password=user_payload["password"])
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    me_response = await client.get("/users/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == user_payload["email"]

    update_response = await client.patch(
        "/users/me",
        json={"user_name": "Updated User", "password": "new-secure-password"},
        headers=headers,
    )
    assert update_response.status_code == 200
    assert update_response.json()["user_name"] == "Updated User"
    assert "password" not in update_response.json()

    updated_login = await login_user(client, email=user_payload["email"], password="new-secure-password")
    assert updated_login.status_code == 200


@pytest.mark.asyncio
async def test_failed_auth_and_duplicate_registration(client):
    first = await register_user(client, email="dup@example.com", password="Password123!", user_name="Dup User")
    assert first.status_code in [200, 201]

    second = await register_user(client, email="dup@example.com", password="OtherPass!", user_name="Other User")
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered"

    bad_login = await login_user(client, email="dup@example.com", password="wrong-password")
    assert bad_login.status_code == 400
    assert bad_login.json()["detail"] == "Incorrect email or password"


@pytest.mark.asyncio
async def test_protected_routes_require_authentication(client):
    unauth_me = await client.get("/users/me")
    assert unauth_me.status_code == 401

    unauth_saved = await client.get("/users/saved-listings")
    assert unauth_saved.status_code == 401

    unauth_save = await client.post("/users/saved-listings", json={"listing_id": "listing-1"})
    assert unauth_save.status_code == 401


@pytest.mark.asyncio
async def test_saved_listings_round_trip(client):
    reg = await register_user(client, email="saved@example.com", password="Password123!", user_name="Saved User")
    assert reg.status_code in [200, 201]

    login = await login_user(client, email="saved@example.com", password="Password123!")
    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    listing = {
        "_id": "listing-1",
        "price": 2500,
        "type": "Apartment",
        "province": "Ontario",
        "beds": 2,
        "baths": 1,
        "sq_feet": 950,
        "location": {"type": "Point", "coordinates": [-79.38, 43.65]},
    }

    db = await __import__("app.db.mongodb", fromlist=["get_database"]).get_database()
    await db["listings"].insert_one(listing)

    save = await client.post("/users/saved-listings", json={"listing_id": "listing-1"}, headers=headers)
    assert save.status_code == 200
    assert save.json()["listing_id"] == "listing-1"

    saved = await client.get("/users/saved-listings", headers=headers)
    assert saved.status_code == 200
    assert [item["_id"] for item in saved.json()] == ["listing-1"]

    remove = await client.delete("/users/saved-listings/listing-1", headers=headers)
    assert remove.status_code == 200
    assert remove.json()["listing_id"] == "listing-1"

    saved_after = await client.get("/users/saved-listings", headers=headers)
    assert saved_after.status_code == 200
    assert saved_after.json() == []


@pytest.mark.asyncio
async def test_listings_endpoints_filter_and_fetch(client):
    db = await __import__("app.db.mongodb", fromlist=["get_database"]).get_database()
    await db["listings"].insert_many([
        {
            "_id": "listing-10",
            "price": 2100,
            "type": "Apartment",
            "province": "Ontario",
            "beds": 2,
            "baths": 1,
            "sq_feet": 900,
            "location": {"type": "Point", "coordinates": [-79.38, 43.65]},
        },
        {
            "_id": "listing-20",
            "price": 4200,
            "type": "House",
            "province": "British Columbia",
            "beds": 4,
            "baths": 3,
            "sq_feet": 1800,
            "location": {"type": "Point", "coordinates": [-123.12, 49.28]},
        },
    ])

    list_all = await client.get("/listings/")
    assert list_all.status_code == 200
    assert len(list_all.json()) >= 2

    filtered = await client.get("/listings/?type=Apartment&price=2500")
    assert filtered.status_code == 200
    assert all(item["type"] == "Apartment" for item in filtered.json())
    assert all(item["price"] <= 2500 for item in filtered.json())

    single = await client.get("/listings/listing-10")
    assert single.status_code == 200
    assert single.json()["_id"] == "listing-10"

    missing = await client.get("/listings/does-not-exist")
    assert missing.status_code == 404


@pytest.mark.asyncio
async def test_health_and_reset_db_endpoints(client):
    head = await client.head("/health/")
    assert head.status_code == 200

    reg = await register_user(client, email="reset@example.com", password="Password123!", user_name="Reset User")
    assert reg.status_code in [200, 201]

    reset = await client.post("/test/reset-db")
    assert reset.status_code == 200
    assert reset.json()["status"] == "Database cleared"

    db = await __import__("app.db.mongodb", fromlist=["get_database"]).get_database()
    assert await db["users"].count_documents({}) == 0