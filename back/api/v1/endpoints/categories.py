from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from crud import categories as crud_categories
from schemas.spent import CategoryRead
from schemas.categories import CategoryCreate, SubCategoryCreate, CategoryUpdate
from api.deps import get_db

router = APIRouter()

@router.get("/total", response_model=List[CategoryRead])
def read_categories(db: Session = Depends(get_db)):
    return crud_categories.get_categories(db=db)

@router.get("/total/{parent_id}", response_model=List[CategoryRead])
def read_sub_categories(parent_id: int, db: Session = Depends(get_db)):
    return crud_categories.get_sub_categories(db=db, parent_id=parent_id)

@router.post("/add")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud_categories.create_category(category=category, db=db)

@router.post("/add/sub")
def create_sub_category(category: SubCategoryCreate, db: Session = Depends(get_db)):
    return crud_categories.create_sub_category(category=category, db=db)

@router.delete("/del")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    return crud_categories.delete_category(category_id=category_id, db=db)

@router.put("/update")
def update_category(category_id: int, category_data: CategoryUpdate, db: Session = Depends(get_db)):
    return crud_categories.update_category(category_id=category_id, category_data=category_data, db=db)