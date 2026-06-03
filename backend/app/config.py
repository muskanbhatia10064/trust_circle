from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./trustcircle.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "demo-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    EXOTEL_SID: str = ""
    EXOTEL_TOKEN: str = ""
    EXOTEL_FROM_NUMBER: str = ""

    USSD_GATEWAY_URL: str = ""
    USSD_API_KEY: str = ""

    PARTNER_WEBHOOK_SECRET: str = ""
    FAIRNESS_DISPARITY_THRESHOLD: float = 0.15
    REINSURANCE_RATE: float = 0.005

    class Config:
        env_file = ".env"


settings = Settings()
