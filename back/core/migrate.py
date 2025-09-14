import os
import sys
import shutil
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from core.database import SessionLocal, engine
from models.user import User
from models.spent import Spent, Base
from core.seed import create_default_users, create_defaut_categories

def backup_database():
    """Sauvegarde la base de données avant migration"""
    db_path = "data/database.db"
    if os.path.exists(db_path):
        backup_path = f"data/database.db.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copy2(db_path, backup_path)
        print(f"💾 Backup créé: {backup_path}")

def check_table_exists(table_name: str) -> bool:
    """Vérifie si une table existe"""
    inspector = inspect(engine)
    return table_name in inspector.get_table_names()

def ensure_column_exists(table_name: str, column_name: str, column_type: str):
    """Ajoute la colonne si elle n'existe pas (SQLite only)"""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    if column_name not in columns:
        print(f"🛠️ Ajout de la colonne '{column_name}' à la table '{table_name}'...")
        with engine.connect() as conn:
            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type};"))
        print(f"✅ Colonne '{column_name}' ajoutée.")

def run_migrations():
    """Exécute toutes les migrations nécessaires"""
    print("🚀 Début des migrations automatiques...")
    
    try:
        # 0. Backup de la DB si elle existe
        backup_database()
        
        # 1. Créer toutes les tables si elles n'existent pas
        print("📋 Vérification et création des tables...")
        Base.metadata.create_all(bind=engine)

        # Vérifie et ajoute la colonne user_id si besoin
        if check_table_exists("spents"):
            ensure_column_exists("spents", "user_id", "INTEGER")

        # 2. Créer les catégories par défaut
        print("🏷️ Création des catégories par défaut...")
        create_defaut_categories()
        
        # 3. Créer les utilisateurs par défaut
        print("👤 Création des utilisateurs par défaut...")
        create_default_users()
        
        # 4. Migrer les dépenses orphelines vers le premier utilisateur
        db = SessionLocal()
        try:
            orphan_count = db.query(Spent).filter(Spent.user_id.is_(None)).count()
            
            if orphan_count > 0:
                print(f"🔗 Migration de {orphan_count} dépenses orphelines...")
                first_user = db.query(User).first()
                
                if first_user:
                    db.query(Spent).filter(Spent.user_id.is_(None)).update(
                        {"user_id": first_user.id}
                    )
                    db.commit()
                    print(f"✅ {orphan_count} dépenses migrées vers {first_user.name}")
                else:
                    print("❌ Aucun utilisateur trouvé pour la migration")
            else:
                print("✅ Aucune dépense orpheline trouvée")
                
        finally:
            db.close()
        
        print("🎉 Migrations terminées avec succès !")
        
    except Exception as e:
        print(f"❌ Erreur lors des migrations: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    run_migrations()