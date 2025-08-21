from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from crud import amount as crud_amount
from api.deps import get_db


router = APIRouter()

@router.get("/total/{category_id}")
def total_for_category(category_id: int, db: Session = Depends(get_db)):
    return {"total": crud_amount.get_total_amount_by_category(db, category_id)}

@router.get("/total")
def total_all(db: Session = Depends(get_db)):
    return {"total": crud_amount.get_total_amount(db)}