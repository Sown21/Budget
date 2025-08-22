from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from crud import salary as crud_salary
from schemas.salary import SalaryCreate, SalaryRead, SalaryUpdate
from api.deps import get_db

router = APIRouter()

@router.post("/", response_model=SalaryRead)
def create_salary(salary: SalaryCreate, db: Session = Depends(get_db)):
    return crud_salary.create_salary(db=db, salary=salary)

@router.get("/", response_model=List[SalaryRead])
def read_salary(db: Session = Depends(get_db)):
    return crud_salary.get_salary(db=db)

@router.delete("/{salary_id}")
def delete_salary(salary_id: int, db: Session = Depends(get_db)):
    return crud_salary.delete_salary(salary_id=salary_id, db=db)

@router.put("/{salary_id}")
def update_salary(salary_id: int, salary_data: SalaryUpdate, db: Session = Depends(get_db)):
    return crud_salary.update_salary(salary_id=salary_id, salary_data=salary_data, db=db)