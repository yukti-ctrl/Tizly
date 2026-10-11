import os
import glob
import json
import firebase_admin
from firebase_admin import credentials
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_firebase(app):
    if firebase_admin._apps:
        print(">>> Firebase already initialized.")
        return

    print("--- Attempting to initialize Firebase ---")
    
    # 1. Check if raw JSON string is provided in environment variable (Render / Cloud friendly)
    env_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
    if env_json:
        try:
            cert_dict = json.loads(env_json)
            # Ensure escaped newlines in private_key are converted properly
            if 'private_key' in cert_dict and '\\n' in cert_dict['private_key']:
                cert_dict['private_key'] = cert_dict['private_key'].replace('\\n', '\n')
            
            cred = credentials.Certificate(cert_dict)
            firebase_admin.initialize_app(cred)
            print(">>> SUCCESS: Firebase Admin SDK Initialized via FIREBASE_CREDENTIALS_JSON env var.")
            return
        except Exception as e:
            print(f"!!! Warning: Failed to parse FIREBASE_CREDENTIALS_JSON: {e}")

    # 2. Check candidate file paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidate_paths = [
        app.config.get('FIREBASE_SERVICE_ACCOUNT'),
        os.path.join(base_dir, 'firebase-service-account.json'),
        '/etc/secrets/firebase-service-account.json', # Render Secret File default path
    ]
    
    # Also look for any tizly-*.json files in backend directory
    wildcards = glob.glob(os.path.join(base_dir, '*firebase*.json'))
    candidate_paths.extend(wildcards)

    for path in candidate_paths:
        if path and os.path.exists(path):
            try:
                print(f"Found credentials at: {path}")
                cred = credentials.Certificate(path)
                firebase_admin.initialize_app(cred)
                print(">>> SUCCESS: Firebase Admin SDK Initialized from file.")
                return
            except Exception as e:
                print(f"!!! Error initializing Firebase with {path}: {e}")

    print("!!! ERROR: No valid Firebase service account credentials found.")
