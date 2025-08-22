from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional

class SalaryCreate(BaseModel):
    name: str
    amount: float
    description: str
    date: str

    @field_validator('date')
    @classmethod
    def parse_date(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return datetime.strptime(v, "%d/%m/%Y").date()
            except Exception:
                raise ValueError("Format de date invalide, attendu JJ/MM/AAAA")
        if isinstance(v, date):
            return v
        raise ValueError("Type de date non supporté")

class SalaryRead(BaseModel):
    id: int
    name: str
    amount: float
    description: str
    date: date

    class Config:
        from_attributes = True

class SalaryUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[str] = None

    @field_validator('date')
    @classmethod
    def parse_date(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            try:
                return datetime.strptime(v, "%d/%m/%Y").date()
            except Exception:
                raise ValueError("Format de date invalide, attendu JJ/MM/AAAA")
        if isinstance(v, date):
            return v
        raise ValueError("Type de date non supporté")