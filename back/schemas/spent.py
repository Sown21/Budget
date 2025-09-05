from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import date, datetime

class SpentCreate(BaseModel):
    name: str
    amount: float
    description: str
    category_id: int
    user_id: int
    date: date

    # @field_validator('date')
    # @classmethod
    # def parse_date(cls, v):
    #     if v is None:
    #         return None
    #     if isinstance(v, str):
    #         try:
    #             return datetime.strptime(v, "%d/%m/%Y").date()
    #         except Exception:
    #             raise ValueError("Format de date invalide, attendu JJ/MM/AAAA")
    #     if isinstance(v, date):
    #         return v
    #     raise ValueError("Type de date non supporté")

class SpentRead(BaseModel):
    id: int
    name: str
    amount: float
    description: str
    category_id: int
    user_id: int
    category_name: Optional[str] = None
    date: date

    class Config:
        from_attributes = True

class CategoryRead(BaseModel):
    id: int
    name: str
    parent_id: Optional[int] = None
    children: List["CategoryRead"] = []

    class Config:
        from_attributes = True

class SpentUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    user_id: Optional[int] = None
    date: Optional[date]

    @field_validator('date', mode='before')
    @classmethod
    def parse_date(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, str):
            try:
                return datetime.strptime(v, "%Y-%m-%d").date()
            except Exception:
                raise ValueError("Format de date invalide, attendu YYYY-MM-DD")
        return v