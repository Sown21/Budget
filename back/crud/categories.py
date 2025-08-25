from sqlalchemy.orm import Session, selectinload
from models.spent import Category

def get_categories(db: Session):
    return db.query(Category).options(selectinload(Category.children)).filter(Category.parent_id == None).all()

def get_sub_categories(db: Session, parent_id: int):
    return db.query(Category).filter(Category.parent_id == parent_id).all()