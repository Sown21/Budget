from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, or_
from models.spent import Spent, Category
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
        ) -> List[dict]:

    query = db.query(Spent).options(selectinload(Spent.category))

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

    spents = query.all()
    return [
        {
            "id": spent.id,
            "name": spent.name,
            "amount": spent.amount,
            "description": spent.description,
            "category_id": spent.category_id,
            "category_name": spent.category.name if spent.category else None,
            "date": spent.date
        }
        for spent in spents
    ]

def create_spent(db: Session, spent: SpentCreate):
    existing_spents = db.query(Spent).filter(Spent.amount == spent.amount, Spent.name == spent.name, Spent.date == spent.date, Spent.category_id == spent.category_id).first()
    if existing_spents:
        raise HTTPException(status_code=409, detail="Cette dépense existe déjà !")
    else:
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

def get_total_spent(year: int, db: Session, month: Optional[int] = None):
    ids_to_exclude = db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10)).subquery()
    query = db.query(func.sum(Spent.amount)).filter(func.extract('year', Spent.date) == year)
    if month:
        query = query.filter(func.extract('month', Spent.date) == month)
    total = query.filter(~Spent.category_id.in_(ids_to_exclude)).scalar()
    return total or 0.0

def get_total_income(year: int, db: Session, month: Optional[int] = None):
    ids_to_keep = db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10)).subquery()
    query = db.query(func.sum(Spent.amount)).filter(func.extract('year', Spent.date) == year)
    if month:
        query = query.filter(func.extract('month', Spent.date) == month)
    total = query.filter(Spent.category_id.in_(ids_to_keep)).scalar()
    return total or 0.0

def get_all_years(db: Session):
    years = db.query(func.extract('year', Spent.date)).distinct().all()
    return [int(y[0]) for y in years]

def get_total_by_category(year: int, db: Session, month: Optional[int] = None):
    results = (db.query(Category.name, func.sum(Spent.amount))
                .join(Spent, Spent.category_id == Category.id)
                .filter(func.extract('year', Spent.date) == year)
                .filter(~Spent.category_id.in_(db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10))))
               )
    if month:
        results = results.filter(func.extract('month', Spent.date) == month)
    results = results.group_by(Category.name).all()
    return [{"category": r[0], "total": r[1]} for r in results]