from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success():
    payload = {"username": "demo", "password": "pass"}
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"].startswith("fake-token-for-")


def test_me_unauthorized():
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_me_authorized():
    payload = {"username": "demo", "password": "pass"}
    login = client.post("/auth/login", json=payload)
    token = login.json()["access_token"]
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"username": "demo"}
