from fastapi import FastAPI
from core.config import settings
from core.database import engine, Base
from api.v1.api import api_router
from models.spent import Spent
from core.seed_categories import create_defaut_categories
from fastapi.middleware.cors import CORSMiddleware
import os

# Avant Base.metadata.create_all(bind=engine)
print("Tables à créer:", list(Base.metadata.tables.keys()))

# Créer les tables
Base.metadata.create_all(bind=engine)

create_defaut_categories()

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_allow_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("CORS_ALLOW_ORIGIN : ", settings.cors_allow_origin)

# Inclure les routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Budget API is running!"}