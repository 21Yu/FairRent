import pytest

@pytest.mark.asyncio
async def test_auth(client):
    user_payload = {
        "email": "test@example.com",
        "password": "securepassword123",
        "user_name": "Test User"
    }

    # 1. Sign up
    reg_response = await client.post("/users/register", json=user_payload)
    assert reg_response.status_code in [200, 201]

    # 2. Login
    login_payload = {
        "username": user_payload["email"],  # FastAPI OAuth2 expects 'username'
        "password": user_payload["password"]
    }
    login_response = await client.post("/users/login", data=login_payload)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # 3. Access Protected /me Route
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

    updated_login = await client.post(
        "/users/login",
        data={"username": user_payload["email"], "password": "new-secure-password"},
    )
    assert updated_login.status_code == 200