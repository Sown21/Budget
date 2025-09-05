from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from crud import user as crud_user
from schemas.user import UserCreate, UserRead
from api.deps import get_db

router = APIRouter()

@router.get("/", response_model=List[UserRead])
def read_users(db: Session = Depends(get_db)):
    return crud_user.get_users(db=db)

@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return crud_user.create_user(db=db, user=user)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return crud_user.delete_user(db=db, user_id=user_id)