from sqlalchemy.orm import Session, selectinload
from models.spent import Category, Spent
from schemas.categories import CategoryCreate, SubCategoryCreate
from sqlalchemy.exc import SQLAlchemyError

def get_categories(db: Session):
    return db.query(Category).options(selectinload(Category.children)).filter(Category.parent_id == None).all()

def get_sub_categories(db: Session, parent_id: int):
    return db.query(Category).filter(Category.parent_id == parent_id).all()

def create_category(category: CategoryCreate, db: Session):
    formatted_name = category.name.strip().capitalize()
    try: 
        db_category = Category(name=formatted_name, parent_id = None)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except SQLAlchemyError as e:
        db.rollback()
        raise e
    
def create_sub_category(category: SubCategoryCreate, db: Session):
    formated_name = category.name.strip().capitalize()
    try:
        db_category = Category(name=formated_name, parent_id=category.parent_id)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except SQLAlchemyError as e:
        db.rollback()
        raise e
    
def delete_category(category_id: int, db: Session):
    try: 
        default_category = 13
        db.query(Spent).filter(Spent.category_id == category_id).update(
            {"category_id": default_category}
        )
        db.query(Category).filter(Category.parent_id == category_id).update({"parent_id": default_category})
        category = db.query(Category).filter(Category.id == category_id).first()
        db.delete(category)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()       
        raise e
