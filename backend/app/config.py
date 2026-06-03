from typing import List, Union
from pydantic import field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Core
    project_name: str = "TrustCircle"
    api_v1_prefix: str = "/api/v1"
    env: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./trustcircle.db"

    # Auth / JWT
    SECRET_KEY: str = "demo-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Person 3 — Exotel / IVR
    EXOTEL_SID: str = ""
    EXOTEL_TOKEN: str = ""
    EXOTEL_FROM_NUMBER: str = ""

    # Person 3 — USSD
    USSD_GATEWAY_URL: str = ""
    USSD_API_KEY: str = ""

    # Person 2/3 — Webhooks & ML
    PARTNER_WEBHOOK_SECRET: str = ""
    FAIRNESS_DISPARITY_THRESHOLD: float = 0.15
    REINSURANCE_RATE: float = 0.005

    # Person 3 — Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    @property
    def is_production(self) -> bool:
        return self.env.lower() == "production"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_url(cls, v: str) -> str:
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    @field_validator("cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v


settings = Settings()
