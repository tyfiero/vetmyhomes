from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    # RapidAPI credentials
    RAPIDAPI_KEY: str
    RAPIDAPI_HOST: str = "realtor16.p.rapidapi.com"

    # Add other settings as needed

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
