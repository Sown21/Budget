from sqlalchemy.orm import Session
from models.spent import Spent
from sqlalchemy import func

def get_total_amount_by_category(db: Session, category_id: int):
    return db.query(func.sum(Spent.amount)).filter(Spent.category_id == category_id).scalar() or 0.0

def get_total_amount(db: Session):
    return db.query(func.sum(Spent.amount)).scalar() or 0.0