from pydantic import BaseModel
from typing import Optional

class SpentCreate(BaseModel):
    name: str
    amount: float
    description: str
    category_id: int

class SpentRead(BaseModel):
    id: int
    name: str
    amount: float
    description: str
    category_id: int

    class Config:
        from_attributes = True

class CategoryRead(BaseModel):
    id: int
    name: str
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True

class SpentUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    category_id: Optional[int] = None