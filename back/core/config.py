from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Budget API"
    database_url: str = "sqlite:///./data/database.db"
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()