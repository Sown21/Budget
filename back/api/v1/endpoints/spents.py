from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from crud import spent as crud_spent
from schemas.spent import SpentCreate, SpentRead, SpentUpdate
from api.deps import get_db

router = APIRouter()

@router.post("/", response_model=SpentRead)
def create_spent(spent: SpentCreate, db: Session = Depends(get_db)):
    return crud_spent.create_spent(db=db, spent=spent)

@router.get("/", response_model=List[SpentRead])
def read_spents(db: Session = Depends(get_db)):
    return crud_spent.get_spents(db=db)

@router.delete("/{spent_id}")
def delete_spent(spent_id: int, db: Session = Depends(get_db)):
    return crud_spent.delete_spent(spent_id=spent_id, db=db)

@router.put("/{spent_id}")
def update_spent(spent_id: int, spent_data: SpentUpdate, db: Session = Depends(get_db)):
    return crud_spent.update_spent(spent_id=spent_id, spent_data=spent_data, db=db)