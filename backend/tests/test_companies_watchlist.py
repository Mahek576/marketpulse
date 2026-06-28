def get_auth_headers(client):
    client.post(
        "/auth/register",
        json={
            "email": "market@example.com",
            "full_name": "Market User",
            "password": "test1234",
        },
    )

    login_response = client.post(
        "/auth/login",
        json={
            "email": "market@example.com",
            "password": "test1234",
        },
    )

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def test_company_and_watchlist_flow(client):
    headers = get_auth_headers(client)

    company_response = client.post(
        "/companies",
        headers=headers,
        json={
            "symbol": "PAYTM",
            "name": "One97 Communications",
            "exchange": "NSE",
            "sector": "Fintech",
            "industry": "Digital Payments",
            "country": "India",
        },
    )

    assert company_response.status_code == 201

    company = company_response.json()

    assert company["id"] == 1
    assert company["symbol"] == "PAYTM"
    assert company["exchange"] == "NSE"

    companies_response = client.get(
        "/companies",
        headers=headers,
    )

    assert companies_response.status_code == 200

    companies = companies_response.json()

    assert len(companies) == 1
    assert companies[0]["symbol"] == "PAYTM"

    watchlist_add_response = client.post(
        "/watchlist/1",
        headers=headers,
    )

    assert watchlist_add_response.status_code == 201

    watchlist_response = client.get(
        "/watchlist",
        headers=headers,
    )

    assert watchlist_response.status_code == 200

    watchlist = watchlist_response.json()

    assert len(watchlist) == 1
    assert watchlist[0]["symbol"] == "PAYTM"

    duplicate_watchlist_response = client.post(
        "/watchlist/1",
        headers=headers,
    )

    assert duplicate_watchlist_response.status_code == 400
    assert (
        duplicate_watchlist_response.json()["error"]["message"]
        == "Company already exists in your watchlist"
    )

    delete_response = client.delete(
        "/watchlist/1",
        headers=headers,
    )

    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Company removed from watchlist"

    empty_watchlist_response = client.get(
        "/watchlist",
        headers=headers,
    )

    assert empty_watchlist_response.status_code == 200
    assert empty_watchlist_response.json() == []