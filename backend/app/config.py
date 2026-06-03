from typing import List, Union
from pydantic import field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment / .env file.
    Person 1 fields: DB, auth, CORS, debug.
    Person 3 fields: Exotel IVR, USSD, partner webhooks, fairness threshold.
    """

    # ----------------------------------------------------
    # Core Application
    # ----------------------------------------------------
    project_name: str = "TrustCircle"
    api_v1_prefix: str = "/api/v1"
    env: str = "development"
    debug: bool = True

    # ----------------------------------------------------
    # Database
    # ----------------------------------------------------
    DATABASE_URL: str

    # ----------------------------------------------------
    # Auth / JWT
    # ----------------------------------------------------
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ----------------------------------------------------
    # CORS
    # ----------------------------------------------------
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # ----------------------------------------------------
    # Person 3 — Exotel / IVR
    # ----------------------------------------------------
    EXOTEL_SID: str = ""
    EXOTEL_TOKEN: str = ""
    EXOTEL_FROM_NUMBER: str = ""

    # ----------------------------------------------------
    # Person 3 — USSD Gateway
    # ----------------------------------------------------
    USSD_GATEWAY_URL: str = ""
    USSD_API_KEY: str = ""

    # ----------------------------------------------------
    # Person 2/3 — Partner Webhooks & ML Config
    # ----------------------------------------------------
    PARTNER_WEBHOOK_SECRET: str = ""
    FAIRNESS_DISPARITY_THRESHOLD: float = 0.15
    REINSURANCE_RATE: float = 0.005

    # ----------------------------------------------------
    # Person 3 — Redis / Celery
    # ----------------------------------------------------
    REDIS_URL: str = "redis://localhost:6379/0"

    # ----------------------------------------------------
    # Computed Properties
    # ----------------------------------------------------
    @property
    def is_production(self) -> bool:
        return self.env.lower() == "production"

    # Pydantic alias so both 'DATABASE_URL' and 'database_url' work
    @property
    def database_url(self) -> str:
        return self.DATABASE_URL

    @property
    def secret_key(self) -> str:
        return self.SECRET_KEY

    @property
    def algorithm(self) -> str:
        return self.ALGORITHM

    @property
    def access_token_expire_minutes(self) -> int:
        return self.ACCESS_TOKEN_EXPIRE_MINUTES

    # ----------------------------------------------------
    # Validators
    # ----------------------------------------------------
    @field_validator("env", mode="before")
    @classmethod
    def validate_env(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("env must be a string.")
        val = v.strip().lower()
        allowed = ["development", "production", "testing"]
        if val not in allowed:
            raise ValueError(f"env must be one of: {', '.join(allowed)}")
        return val

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_and_fix_database_url(cls, v: str) -> str:
        if not v:
            raise ValueError("DATABASE_URL must be provided.")
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    @field_validator("SECRET_KEY", mode="after")
    @classmethod
    def validate_secret_key(cls, v: str, info: ValidationInfo) -> str:
        if not v or not v.strip():
            raise ValueError("SECRET_KEY cannot be empty.")
        env_val = info.data.get("env", "development")
        if env_val.lower() == "production":
            if len(v) < 32:
                raise ValueError("SECRET_KEY must be at least 32 chars in production.")
            unsafe = ("secret", "change_me", "changeme", "placeholder", "default")
            if v.lower() in unsafe:
                raise ValueError("Unsafe SECRET_KEY placeholder not allowed in production.")
        return v

    @field_validator("cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if not v.strip():
                return []
            return [o.strip() for o in v.split(",") if o.strip()]
        elif isinstance(v, list):
            return [str(o).strip() for o in v if str(o).strip()]
        return []

    def model_post_init(self, __context) -> None:
        super().model_post_init(__context)
        if self.is_production:
            object.__setattr__(self, "debug", False)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()
