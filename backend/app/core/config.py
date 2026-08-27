# Envs (Mongo URI, Secret Key, JWT settings)from pydantic_settings import BaseSettings

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "fairrent"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    class Config:
        env_file = ".env"

settings = Settings()