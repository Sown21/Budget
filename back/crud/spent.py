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
    user_id: int,
    category_id: Optional[int] = None,
    date_min: Optional[date] = None,
    date_max: Optional[date] = None,
    amount_min: Optional[float] = None,
    amount_max: Optional[float] = None,
    search: Optional[str] = None,
    ) -> List[dict]:

    query = db.query(Spent).options(selectinload(Spent.category)).filter(Spent.user_id == user_id)

    if category_id is not None:
        query = query.filter(Spent.category_id == category_id)
    if date_min:
        query = query.filter(Spent.date >= date_min)
    if date_max:
        query = query.filter(Spent.date <= date_max)
    if amount_min is not None:
        query = query.filter(Spent.amount >= amount_min)
    if amount_max is not None:
        query = query.filter(Spent.amount <= amount_max)
    if search:
        query = query.filter(
            or_(
                Spent.name.ilike(f"%{search}%"),
                Spent.description.ilike(f"%{search}%")
            )
        )

    spents = query.all()
    return [
        {
            "id": spent.id,
            "name": spent.name,
            "amount": spent.amount,
            "description": spent.description,
            "category_id": spent.category_id,
            "user_id": spent.user_id,
            "category_name": spent.category.name if spent.category else None,
            "date": spent.date
        }
        for spent in spents
    ]

def create_spent(db: Session, spent: SpentCreate):
    existing_spents = db.query(Spent).filter(Spent.amount == spent.amount, Spent.name == spent.name, Spent.date == spent.date, Spent.category_id == spent.category_id, Spent.user_id == spent.user_id).first()
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

def get_total_spent(year: int, user_id: int, db: Session, month: Optional[int] = None):
    ids_to_exclude = db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10)).subquery()
    query = db.query(func.sum(Spent.amount)).filter(func.extract('year', Spent.date) == year, Spent.user_id == user_id)
    if month:
        query = query.filter(func.extract('month', Spent.date) == month)
    total = query.filter(~Spent.category_id.in_(ids_to_exclude)).scalar()
    return round(total or 0.0, 2)

def get_total_income(year: int, user_id: int, db: Session, month: Optional[int] = None):
    ids_to_keep = db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10)).subquery()
    query = db.query(func.sum(Spent.amount)).filter(func.extract('year', Spent.date) == year, Spent.user_id == user_id)
    if month:
        query = query.filter(func.extract('month', Spent.date) == month)
    total = query.filter(Spent.category_id.in_(ids_to_keep)).scalar()
    return round(total or 0.0, 2)

def get_total_remaining_by_month(year: int, user_id: int, db: Session, month: int):
    prev_month = month - 1 if month > 1 else 12
    prev_year = year if month > 1 else year - 1
    total_spent = get_total_spent(year=year, user_id=user_id, month=month, db=db)
    total_income = get_total_income(year=prev_year, user_id=user_id, month=prev_month, db=db)
    remaining = total_income - total_spent
    return round(remaining, 0)

def get_all_years(user_id: int, db: Session):
    years = db.query(func.extract('year', Spent.date)).filter(Spent.user_id == user_id).distinct().all()
    return [int(y[0]) for y in years]

def get_total_by_category(year: int, user_id: int, db: Session, month: Optional[int] = None):
    results = (db.query(Category.name, func.sum(Spent.amount))
                .join(Spent, Spent.category_id == Category.id)
                .filter(Spent.user_id == user_id)
                .filter(func.extract('year', Spent.date) == year)
                .filter(~Spent.category_id.in_(db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10))))
               )
    if month:
        results = results.filter(func.extract('month', Spent.date) == month)
    results = results.group_by(Category.name).all()
    return [{"category": r[0], "total": r[1]} for r in results]

def get_year_income(year: int, user_id: int, db: Session, month: Optional[int] = None):
    ids_to_keep = db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10)).subquery()
    query = db.query(Spent).filter(func.extract('year', Spent.date) == year).filter(Spent.user_id == user_id)
    # if month:
    #     query = query.filter(func.extract('month', Spent.date) == month)
    data = query.filter(Spent.category_id.in_(ids_to_keep)).all()
    return data

def get_year_spent(year: int, user_id: int, db: Session, month: Optional[int] = None):
    ids_to_exclude = db.query(Category.id).filter(or_(Category.id == 10, Category.parent_id == 10)).subquery()
    # query = db.query(func.sum(Spent.amount)).filter(func.extract('year', Spent.date) == year)
    query = db.query(Spent).filter(func.extract('year', Spent.date) == year).filter(Spent.user_id == user_id)
    # if month:
    #     query = query.filter(func.extract('month', Spent.date) == month)
    data = query.filter(~Spent.category_id.in_(ids_to_exclude)).all()
    return data

def compare_prev_month_spents(user_id: int, year: int, month: int, db: Session):
    use_year = year if month > 1 else year - 1
    actual_month = get_total_spent(year, user_id, db, month)
    prev_month = get_total_spent(use_year, user_id, db, month - 1)
    if prev_month == 0:
        return None
    result = round(((actual_month - prev_month) / prev_month) * 100)
    return result

def compare_prev_year_spents(user_id: int, year: int, db: Session):
    actual_year = get_total_spent(year, user_id, db)
    prev_year = get_total_spent(year - 1, user_id, db)
    if prev_year == 0:
        return None
    result = round(((actual_year - prev_year) / prev_year) * 100)
    return result