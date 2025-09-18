import requests
from datetime import date
import os

api_url = f"http://localhost:8022/api/v1/"

script_dir = os.path.dirname(os.path.abspath(__file__))
bkp_path = os.path.join(script_dir, "../data/exports/")

timestamp = date.today()

def get_users():
    reponse = requests.get(f"{api_url}users/")
    users = reponse.json()
    users_id = [user["id"] for user in users]
    users_name = [user["name"] for user in users]
    return users_id, users_name

def export_csv_for_user(user_id, user_name):
    os.makedirs(bkp_path, exist_ok=True)
    response = requests.get(f"{api_url}spents/export?user_id={user_id}")
    if response.status_code == 200:
        with open(f"{bkp_path}{timestamp}_export_{user_name}.csv", "wb") as f:
            f.write(response.content)
    
if __name__ == "__main__":
    ids, names = get_users()
    for id, name in zip(ids, names):  
        export_csv_for_user(id, name)