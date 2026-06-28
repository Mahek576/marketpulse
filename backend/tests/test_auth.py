def test_register_login_and_get_current_user(client):
    register_response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "test1234",
        },
    )

    assert register_response.status_code == 201

    registered_user = register_response.json()

    assert registered_user["email"] == "test@example.com"
    assert registered_user["full_name"] == "Test User"
    assert registered_user["is_active"] is True

    duplicate_response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "test1234",
        },
    )

    assert duplicate_response.status_code == 400
    assert duplicate_response.json()["error"]["message"] == "Email is already registered"

    login_response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "test1234",
        },
    )

    assert login_response.status_code == 200

    token_data = login_response.json()

    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    me_response = client.get(
        "/auth/me",
        headers={
            "Authorization": f"Bearer {token_data['access_token']}",
        },
    )

    assert me_response.status_code == 200

    current_user = me_response.json()

    assert current_user["email"] == "test@example.com"
    assert current_user["full_name"] == "Test User"


def test_login_with_wrong_password_fails(client):
    client.post(
        "/auth/register",
        json={
            "email": "wrong@example.com",
            "full_name": "Wrong Password User",
            "password": "test1234",
        },
    )

    login_response = client.post(
        "/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpassword",
        },
    )

    assert login_response.status_code == 401
    assert login_response.json()["error"]["message"] == "Invalid email or password"