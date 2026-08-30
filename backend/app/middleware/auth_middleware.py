from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.db.mongodb import get_database

class OAuth2PasswordCookie(HTTPBearer):
    """Extracts the access token from an HTTP-only cookie."""
    async def __call__(self, request: Request) -> str:
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Strip "Bearer " prefix if included in cookie value
        if token.startswith("Bearer "):
            token = token[7:]
        return token

oauth2_cookie_scheme = OAuth2PasswordCookie()

async def get_current_user(
    token: str = Depends(oauth2_cookie_scheme), 
    db = Depends(get_database)
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception

    user["id"] = str(user["_id"])
    return user