from fastapi import APIRouter
from api.v1.endpoints import spents
from api.v1.endpoints import categories
from api.v1.endpoints import amount
from api.v1.endpoints import user

api_router = APIRouter()
api_router.include_router(spents.router, prefix="/spents", tags=["spents"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(amount.router, prefix="/amount", tags=["amount"])
api_router.include_router(user.router, prefix="/users", tags=["users"])