from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

def get_users(db: Session):
    return db.query(User).all()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    # Vérifier si l'utilisateur existe déjà
    existing_user = db.query(User).filter(User.name == user.name).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Un utilisateur avec ce nom existe déjà")
    formatted_name = user.name.strip().capitalize()
    db_user = User(name=formatted_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprimé", "id": user_id}

def update_user(db: Session, user_id: int, user_data):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        if "name" in user_data:
            user.name = user_data["name"].strip().capitalize()
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Un utilisateur avec ce nom existe déjà"
            )
        db.refresh(user)
        return user
    raise HTTPException(status_code=404, detail=f"L'utilisateur {user_id} n'existe pas.")

