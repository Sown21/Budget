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
    user_id: int = Query(..., description="ID de l'utilisateur"),
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
        user_id=user_id,
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
def get_total_spent(year: int, user_id: int, month: Optional[int] = None, db: Session = Depends(get_db)):
    return crud_spent.get_total_spent(year=year, user_id=user_id, month=month, db=db)

@router.get("/total/income/")
def get_total_income(year: int, user_id: int, month: Optional[int] = None, db: Session = Depends(get_db)):
    return crud_spent.get_total_income(year=year, user_id=user_id, month=month, db=db)

@router.get("/total/remaining/")
def get_total_remaining(year: int, user_id: int, db: Session = Depends(get_db)):
    return crud_spent.get_total_remaining(year=year, user_id=user_id, db=db)

@router.get("/total/remaining/month")
def get_total_remaining_by_month(year: int, month: int, user_id: int, db: Session = Depends(get_db)):
    return crud_spent.get_total_remaining_by_month(year=year, user_id=user_id, month=month, db=db)

@router.get("/all/years/")
def get_all_years(user_id: int, db: Session = Depends(get_db)):
    return crud_spent.get_all_years(user_id=user_id, db=db)

@router.get("/total/by_category/")
def get_total_by_category(year: int, user_id: int, month: Optional[int] = None, db: Session = Depends(get_db)):
    return crud_spent.get_total_by_category(year=year, user_id=user_id, month=month, db=db)

@router.get("/year/income/")
def get_year_income(year: int, user_id: int, month: Optional[int] = None, db: Session = Depends(get_db)):
    return crud_spent.get_year_income(year=year, user_id=user_id, month=month, db=db)

@router.get("/year/spent/")
def get_year_spent(year: int, user_id: int, month: Optional[int] = None, db: Session = Depends(get_db)):
    return crud_spent.get_year_spent(year=year, user_id=user_id, month=month, db=db)

@router.get("/compare/month")
def compare_prev_month_spents(user_id: int, year: int, month: int, db: Session = Depends(get_db)):
    return crud_spent.compare_prev_month_spents(user_id=user_id, year=year, month=month, db=db)

@router.get("/compare/year")
def compare_prev_year_spents(user_id: int, year: int, db: Session = Depends(get_db)):
    return crud_spent.compare_prev_year_spents(user_id=user_id, year=year, db=db)

@router.get("/compare/income/month")
def compare_prev_month_income(user_id: int, year: int, month: int, db: Session = Depends(get_db)):
    return crud_spent.compare_prev_month_income(user_id=user_id, year=year, month=month, db=db)

@router.get("/compare/income/year")
def compare_prev_year_income(user_id: int, year: int, db: Session = Depends(get_db)):
    return crud_spent.compare_prev_year_income(user_id=user_id, year=year, db=db)

@router.get("/compare/remaining/month")
def compare_remaining_month(user_id: int, year: int, month: int, db: Session = Depends(get_db)):
    return crud_spent.compare_remaining_month(user_id=user_id, year=year, month=month, db=db)

@router.get("/compare/remaining/year")
def compare_remaining_year(user_id: int, year: int, db: Session = Depends(get_db)):
    return crud_spent.compare_remaining_year(user_id=user_id, year=year, db=db)

@router.get("/export")
def export_spents_csv(user_id: int, db: Session = Depends(get_db)):
    return crud_spent.export_spents_csv(user_id=user_id, db=db)