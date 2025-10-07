from fastapi import APIRouter, HTTPException, Header
from fastapi import status
from pydantic import BaseModel
from app.core.security import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Simple in-memory user store for demo purposes
USERS = {
    "demo": "pass",
    "admin": "admin",
}


def validate_credentials(username: str, password: str) -> bool:
    expected = USERS.get(username)
    return expected is not None and expected == password


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    if not validate_credentials(payload.username, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=payload.username)
    return TokenResponse(access_token=token)


@router.get("/me")
async def me(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"username": username}
