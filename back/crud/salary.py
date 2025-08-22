from sqlalchemy.orm import Session
from models.salary import Salary
from schemas.salary import SalaryCreate, SalaryUpdate
from fastapi import HTTPException

def get_salary(db: Session, salary_id: int):
    return db.query(Salary).filter(Salary.id == salary_id).first()

def get_salary(db: Session):
    return db.query(Salary).all()

def create_salary(db: Session, salary: SalaryCreate):
    db_salary = Salary(**salary.model_dump())
    db.add(db_salary)
    db.commit()
    db.refresh(db_salary)
    return db_salary

def delete_salary(salary_id: int, db: Session):
    salary = db.query(Salary).filter(Salary.id == salary_id).first()
    if salary:
        db.delete(salary)
        db.commit()
        return {"message": "Salaire supprimé", "id": salary_id}
    raise HTTPException(status_code=404, detail="Salaire non trouvé")

def update_salary(salary_id: int, salary_data: SalaryUpdate, db: Session):
    salary = db.query(Salary).filter(Salary.id == salary_id).first()
    if salary:
        update_data = salary_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(salary, field, value)
        db.commit()
        db.refresh(salary)
        return salary
    raise HTTPException(status_code=404, detail=f"Le salaire {salary_id} n'existe pas.")
