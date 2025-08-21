from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from crud import categories as crud_categories
from schemas.spent import CategoryRead
from api.deps import get_db

router = APIRouter()

@router.get("/total", response_model=List[CategoryRead])
def read_categories(db: Session = Depends(get_db)):
    return crud_categories.get_categories(db=db)

@router.get("/total/{parent_id}", response_model=List[CategoryRead])
def read_sub_categories(parent_id: int, db: Session = Depends(get_db)):
    return crud_categories.get_sub_categories(db=db, parent_id=parent_id)