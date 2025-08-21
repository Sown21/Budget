from sqlalchemy.orm import Session
from models.spent import Spent, Category
from schemas.spent import SpentCreate

def get_spent(db: Session, spent_id: int):
    return db.query(Spent).filter(Spent.id == spent_id).first()

def get_spents(db: Session):
    return db.query(Spent).all()

def create_spent(db: Session, spent: SpentCreate):
    db_spent = Spent(**spent.model_dump())
    db.add(db_spent)
    db.commit()
    db.refresh(db_spent)
    return db_spent

def get_categories(db: Session):
    return db.query(Category).filter(Category.parent_id == None).all()

def get_sub_categories(db: Session, parent_id: int):
    return db.query(Category).filter(Category.parent_id == parent_id).all()