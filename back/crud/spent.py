from sqlalchemy.orm import Session
from models.spent import Spent
from schemas.spent import SpentCreate
from fastapi import HTTPException

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

def delete_spent(spent_id: int, db: Session):
    spent = db.query(Spent).filter(Spent.id == spent_id).first()
    if spent:
        db.delete(spent)
        db.commit()
        return {"message": "Dépense supprimée", "id": spent_id}
    raise HTTPException(status_code=404, detail="Dépense non trouvée")
