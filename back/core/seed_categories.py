from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.spent import Category

def create_defaut_categories():
    db = SessionLocal()
    try:
        existing_categories = db.query(Category.name).all()
        existing_names = [name for (name,) in existing_categories]
        
        default_categories = [
            Category(id=1, name="Alimentation", parent_id=None),
            Category(id=2, name="Transport", parent_id=None),
            Category(id=3, name="Logement", parent_id=None),
            Category(id=4, name="Loisirs", parent_id=None),
            Category(id=5, name="Santé", parent_id=None),
            Category(id=6, name="Vêtements", parent_id=None),
            Category(id=7, name="Epargne", parent_id=None),
            Category(id=8, name="Investissement", parent_id=None),
            Category(id=9, name="Factures", parent_id=None),
            Category(id=10, name="Revenu", parent_id=None),
            Category(id=11, name="Animaux", parent_id=None),
            Category(id=12, name="A prévoir"),
            Category(id=13, name="Autres", parent_id=None),
        ]

        for category in default_categories:
            if category.name not in existing_names:
                db.add(category)

        db.commit()

        sub_categories = [
            Category(name="Courses", parent_id=1),
            Category(name="Fast-Food", parent_id=1),
            Category(name="Restaurant", parent_id=1),

            Category(name="Essence", parent_id=2),
            Category(name="Parking", parent_id=2),
            Category(name="Entretien du véhicule", parent_id=2),
            Category(name="Assurance voiture", parent_id=2),

            Category(name="Crédit Appartement", parent_id=3),
            Category(name="Travaux", parent_id=3),
            Category(name="Copropriété", parent_id=3),

            Category(name="Livres", parent_id=4),
            Category(name="Jeux vidéo", parent_id=4),

            Category(name="Médecin", parent_id=5),
            Category(name="Pharmacie", parent_id=5),
            Category(name="Dentiste", parent_id=5),
            Category(name="Opticien", parent_id=5),
            Category(name="Assurance santé", parent_id=5),

            Category(name="Electricité", parent_id=9),
            Category(name="Eau", parent_id=9),
            Category(name="Internet", parent_id=9),
            Category(name="Mobile", parent_id=9),
            Category(name="Crédit conso", parent_id=9),

            Category(name="Salaire Neofacto", parent_id=10),
            Category(name="Pension Armée", parent_id=10),  
            Category(name="Pôle Emploi Boulette", parent_id=10),
            Category(name="Spacestylist", parent_id=10),

            Category(name="Lapin", parent_id=11),
            Category(name="Chat", parent_id=11),
        ]

        for sub_category in sub_categories:
            if sub_category.name not in existing_names:
                db.add(sub_category)

        db.commit()
        print("Les Catégories et sous catégories ont été créées avec succès !")
    
    except Exception as e:
        db.rollback()
        print(f"Erreur lors de la création des catégories par défaut : {e}")
    finally:
        db.close()