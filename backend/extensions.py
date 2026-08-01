import os
import firebase_admin
from firebase_admin import credentials
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_firebase(app):
    # Get the absolute path to the backend folder
    base_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(base_dir, 'firebase-service-account.json')
    
    print(f"--- Attempting to initialize Firebase ---")
    print(f"Looking for credentials at: {cred_path}")

    if not firebase_admin._apps:
        try:
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                print(">>> SUCCESS: Firebase Admin SDK Initialized.")
            else:
                # If this prints, the file name is wrong or it's in the wrong folder
                print("!!! ERROR: firebase-service-account.json NOT FOUND.")
        except Exception as e:
            print(f"!!! ERROR during initialize_app: {str(e)}")
    else:
        print(">>> Firebase already initialized.")

