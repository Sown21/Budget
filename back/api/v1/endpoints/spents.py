from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from crud import spent as crud_spent
from schemas.spent import SpentCreate, SpentRead, SpentUpdate
from api.deps import get_db
from datetime import date

router = APIRouter()

@router.post("/", response_model=SpentRead)
def create_spent(spent: SpentCreate, db: Session = Depends(get_db)):
    return crud_spent.create_spent(db=db, spent=spent)

@router.get("/", response_model=List[SpentRead])
def read_spents(
    category_id: Optional[int] = Query(None),
    date_min: Optional[date] = Query(None),
    date_max: Optional[date] = Query(None),
    amount_min: Optional[float] = Query(None),
    amount_max: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return crud_spent.get_spents(
        db=db,
        category_id=category_id,
        date_min=date_min,
        date_max=date_max,
        amount_min=amount_min,
        amount_max=amount_max,
        search=search
    )

@router.delete("/{spent_id}")
def delete_spent(spent_id: int, db: Session = Depends(get_db)):
    return crud_spent.delete_spent(spent_id=spent_id, db=db)

@router.put("/{spent_id}")
def update_spent(spent_id: int, spent_data: SpentUpdate, db: Session = Depends(get_db)):
    return crud_spent.update_spent(spent_id=spent_id, spent_data=spent_data, db=db)

@router.get("/total/")
def get_total_spent(year: int, db: Session = Depends(get_db)):
    return crud_spent.get_total_spent(year=year, db=db)

@router.get("/total/income/")
def get_total_income(year: int, db: Session = Depends(get_db)):
    return crud_spent.get_total_income(year=year, db=db)