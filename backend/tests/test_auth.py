"""Sprint 1 tests: registration, login, JWT handling, profile, preferences and role restrictions."""
from datetime import timedelta

from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password

API = "/api/v1/auth"


def register(client, **overrides):
    body = {"email": "asha@example.com", "password": "Secret123", "full_name": "Asha Rao", "role": "renter"}
    body.update(overrides)
    return client.post(f"{API}/register", json=body)


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


# ------------------------------------------------------------------ security helpers
def test_password_hashing_uses_bcrypt():
    hashed = hash_password("Secret123")
    assert hashed.startswith("$2b$") and hashed != "Secret123"
    assert verify_password("Secret123", hashed)
    assert not verify_password("Wrong123", hashed)
    assert not verify_password("Secret123", None)
    assert not verify_password("Secret123", "not-a-hash")


def test_token_types_are_enforced():
    access = create_access_token(7, "renter")
    refresh = create_refresh_token(7)
    assert decode_token(access, "access")["role"] == "renter"
    assert decode_token(refresh, "refresh")["sub"] == "7"


# ------------------------------------------------------------------ registration
def test_register_creates_user_and_returns_tokens(client, db):
    response = register(client)
    assert response.status_code == 201
    data = response.json()
    assert data["token_type"] == "bearer" and data["expires_in"] > 0
    assert data["user"]["email"] == "asha@example.com"
    assert data["user"]["role"] == "renter" and data["user"]["is_active"] is True
    assert "hashed_password" not in data["user"]
    assert decode_token(data["access_token"], "access")["sub"] == str(data["user"]["id"])


def test_register_landlord_role(client):
    response = register(client, email="owner@example.com", role="landlord")
    assert response.status_code == 201 and response.json()["user"]["role"] == "landlord"


def test_register_rejects_duplicate_email_case_insensitively(client):
    assert register(client).status_code == 201
    response = register(client, email="ASHA@Example.com")
    assert response.status_code == 409


def test_register_validation_errors(client):
    assert register(client, email="not-an-email").status_code == 422
    assert register(client, password="short1").status_code == 422
    assert register(client, password="onlyletters").status_code == 422
    assert register(client, password="12345678").status_code == 422
    assert register(client, full_name="   ").status_code == 422
    assert register(client, role="admin").status_code == 422  # admins cannot self-register


# ------------------------------------------------------------------ login
def test_login_with_json(client):
    register(client)
    response = client.post(f"{API}/login", json={"email": "Asha@example.com", "password": "Secret123"})
    assert response.status_code == 200
    me = client.get(f"{API}/me", headers=auth_header(response.json()["access_token"]))
    assert me.status_code == 200 and me.json()["full_name"] == "Asha Rao"


def test_login_with_oauth2_form(client):
    register(client)
    response = client.post(f"{API}/token", data={"username": "asha@example.com", "password": "Secret123"})
    assert response.status_code == 200 and response.json()["token_type"] == "bearer"


def test_login_failures(client):
    register(client)
    wrong = client.post(f"{API}/login", json={"email": "asha@example.com", "password": "Wrong1234"})
    assert wrong.status_code == 401
    unknown = client.post(f"{API}/login", json={"email": "ghost@example.com", "password": "Secret123"})
    assert unknown.status_code == 401
    form = client.post(f"{API}/token", data={"username": "asha@example.com", "password": "Wrong1234"})
    assert form.status_code == 401


def test_deactivated_user_cannot_log_in_or_use_token(client, db, make_user):
    user, headers = make_user(email="sleepy@example.com")
    user.is_active = False
    db.commit()
    assert client.post(f"{API}/login", json={"email": "sleepy@example.com", "password": "Passw0rd!"}).status_code == 403
    assert client.get(f"{API}/me", headers=headers).status_code == 403


# ------------------------------------------------------------------ tokens
def test_me_requires_a_valid_access_token(client, make_user):
    user, headers = make_user()
    assert client.get(f"{API}/me").status_code == 401
    assert client.get(f"{API}/me", headers=auth_header("garbage")).status_code == 401
    expired = create_access_token(user.id, user.role, expires_delta=timedelta(seconds=-1))
    response = client.get(f"{API}/me", headers=auth_header(expired))
    assert response.status_code == 401 and "expired" in response.json()["detail"].lower()
    refresh_as_access = create_refresh_token(user.id)
    assert client.get(f"{API}/me", headers=auth_header(refresh_as_access)).status_code == 401
    assert client.get(f"{API}/me", headers=headers).json()["id"] == user.id


def test_token_for_deleted_user_is_rejected(client, db, make_user):
    user, headers = make_user()
    db.delete(user)
    db.commit()
    assert client.get(f"{API}/me", headers=headers).status_code == 401


def test_refresh_issues_new_tokens(client, make_user):
    user, _headers = make_user()
    response = client.post(f"{API}/refresh", json={"refresh_token": create_refresh_token(user.id)})
    assert response.status_code == 200
    assert decode_token(response.json()["access_token"], "access")["sub"] == str(user.id)
    access_as_refresh = create_access_token(user.id, user.role)
    assert client.post(f"{API}/refresh", json={"refresh_token": access_as_refresh}).status_code == 401


def test_logout_requires_auth(client, make_user):
    _user, headers = make_user()
    assert client.post(f"{API}/logout").status_code == 401
    assert client.post(f"{API}/logout", headers=headers).status_code == 200


# ------------------------------------------------------------------ profile
def test_update_profile_name(client, make_user):
    _user, headers = make_user()
    response = client.patch(f"{API}/me", json={"full_name": "  Riya Patel  "}, headers=headers)
    assert response.status_code == 200 and response.json()["full_name"] == "Riya Patel"
    assert client.patch(f"{API}/me", json={"full_name": " "}, headers=headers).status_code == 422


def test_change_password(client, make_user):
    _user, headers = make_user(email="pw@example.com")
    bad = client.post(f"{API}/me/change-password",
                      json={"current_password": "nope", "new_password": "Another123"}, headers=headers)
    assert bad.status_code == 400
    ok = client.post(f"{API}/me/change-password",
                     json={"current_password": "Passw0rd!", "new_password": "Another123"}, headers=headers)
    assert ok.status_code == 200
    assert client.post(f"{API}/login", json={"email": "pw@example.com", "password": "Passw0rd!"}).status_code == 401
    assert client.post(f"{API}/login", json={"email": "pw@example.com", "password": "Another123"}).status_code == 200


# ------------------------------------------------------------------ preferences (FR-02)
def test_preferences_are_created_empty_on_first_read(client, make_user):
    user, headers = make_user()
    response = client.get(f"{API}/me/preferences", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user.id
    assert data["min_budget"] is None and data["preferred_localities"] == [] and data["property_types"] == []


def test_update_preferences_normalises_values(client, make_user):
    _user, headers = make_user()
    body = {
        "min_budget": 8000,
        "max_budget": 20000,
        "preferred_localities": ["satellite", "  prahlad   nagar ", "Satellite"],
        "property_types": ["Flat", "pg", "apartment"],
        "min_bedrooms": 2,
    }
    response = client.put(f"{API}/me/preferences", json=body, headers=headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["preferred_localities"] == ["Satellite", "Prahlad Nagar"]
    assert data["property_types"] == ["apartment", "pg"]
    assert (data["min_budget"], data["max_budget"], data["min_bedrooms"]) == (8000, 20000, 2)
    again = client.get(f"{API}/me/preferences", headers=headers).json()
    assert again["id"] == data["id"] and again["max_budget"] == 20000  # persisted, still one row


def test_preferences_put_replaces_previous_values(client, make_user):
    _user, headers = make_user()
    client.put(f"{API}/me/preferences", json={"max_budget": 20000, "min_bedrooms": 2}, headers=headers)
    data = client.put(f"{API}/me/preferences", json={"property_types": ["studio"]}, headers=headers).json()
    assert data["max_budget"] is None and data["min_bedrooms"] is None and data["property_types"] == ["studio"]


def test_preferences_validation(client, make_user):
    _user, headers = make_user()
    assert client.put(f"{API}/me/preferences", json={"min_budget": 30000, "max_budget": 10000},
                      headers=headers).status_code == 422
    assert client.put(f"{API}/me/preferences", json={"min_budget": -1}, headers=headers).status_code == 422
    assert client.put(f"{API}/me/preferences", json={"property_types": ["castle"]}, headers=headers).status_code == 422
    assert client.put(f"{API}/me/preferences", json={"min_bedrooms": -2}, headers=headers).status_code == 422
    assert client.get(f"{API}/me/preferences").status_code == 401


def test_preferences_are_private_per_user(client, make_user):
    _a, headers_a = make_user(email="a@example.com")
    _b, headers_b = make_user(email="b@example.com")
    client.put(f"{API}/me/preferences", json={"max_budget": 15000}, headers=headers_a)
    assert client.get(f"{API}/me/preferences", headers=headers_b).json()["max_budget"] is None


def test_deleting_user_cascades_to_preferences(client, db, make_user):
    from app.models.user import UserPreference

    user, headers = make_user()
    client.put(f"{API}/me/preferences", json={"max_budget": 15000}, headers=headers)
    db.delete(db.get(type(user), user.id))
    db.commit()
    assert db.query(UserPreference).count() == 0


# ------------------------------------------------------------------ role-based access (NFR-04)
def test_only_admins_can_list_users(client, make_user):
    _renter, renter_headers = make_user("renter")
    _landlord, landlord_headers = make_user("landlord")
    _admin, admin_headers = make_user("admin")
    assert client.get(f"{API}/users", headers=renter_headers).status_code == 403
    assert client.get(f"{API}/users", headers=landlord_headers).status_code == 403
    response = client.get(f"{API}/users", headers=admin_headers)
    assert response.status_code == 200 and len(response.json()) == 3
    landlords = client.get(f"{API}/users?role=landlord", headers=admin_headers).json()
    assert [u["role"] for u in landlords] == ["landlord"]


def test_health_endpoint(client):
    assert client.get("/health").json() == {"status": "ok", "database": "ok"}
