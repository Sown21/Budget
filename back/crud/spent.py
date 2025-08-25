from sqlalchemy.orm import Session
from models.spent import Spent
from schemas.spent import SpentCreate, SpentUpdate
from fastapi import HTTPException
from typing import Optional, List
from datetime import date

def get_spent(db: Session, spent_id: int):
    return db.query(Spent).filter(Spent.id == spent_id).first()

def get_spents(
        db: Session,
        category_id: Optional[int] = None,
        date_min: Optional[date] = None,
        date_max: Optional[date] = None,
        amount_min: Optional[float] = None,
        amount_max: Optional[float] = None,
        search: Optional[str] = None
        ) -> List[Spent]:

    query = db.query(Spent)

    if category_id is not None:
        query = query.filter(Spent.category_id == category_id)
    if date_min is not None:
        query = query.filter(Spent.date >= date_min)
    if date_max is not None:
        query = query.filter(Spent.date <= date_max)
    if amount_min is not None:
        query = query.filter(Spent.amount >= amount_min)
    if amount_max is not None:
        query = query.filter(Spent.amount <= amount_max)
    if search is not None:
        query = query.filter(Spent.name.ilike(f"%{search}%"))

    return query.all()

def create_spent(db: Session, spent: SpentCreate):
    db_spent = Spent(**spent.model_dump())
    db.add(db_spent)
    db.commit()
    db.refresh(db_spent)
    return db_spent

def delete_spent(spent_id: int, db: Session):
    spent = db.query(Spent).filter(Spent.id == spent_id).first()
    if spent:
        db.delete(spent)
        db.commit()
        return {"message": "Dépense supprimée", "id": spent_id}
    raise HTTPException(status_code=404, detail="Dépense non trouvée")

def update_spent(spent_id: int, spent_data: SpentUpdate, db: Session):
    spent = db.query(Spent).filter(Spent.id == spent_id).first()
    if spent:
        update_data = spent_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(spent, field, value)
        db.commit()
        db.refresh(spent)
        return spent
    raise HTTPException(status_code=404, detail=f"La dépense {spent_id} n'existe pas.")
