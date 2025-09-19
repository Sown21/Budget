#!/bin/bash

echo "🚀 Démarrage de l'application Budget..."

# Exécuter les migrations
echo "📊 Exécution des migrations..."
python core/migrate.py

# Vérifier que les migrations ont réussi
if [ $? -eq 0 ]; then
    echo "✅ Migrations terminées avec succès"

    cron
    
    # Démarrer l'application
    echo "🌟 Démarrage du serveur FastAPI..."
    exec uvicorn main:app --host 0.0.0.0 --port 8022
else
    echo "❌ Échec des migrations"
    exit 1
fi