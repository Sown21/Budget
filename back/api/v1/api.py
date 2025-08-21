from fastapi import APIRouter
from api.v1.endpoints import spents
from api.v1.endpoints import categories

api_router = APIRouter()
api_router.include_router(spents.router, prefix="/spents", tags=["spents"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])