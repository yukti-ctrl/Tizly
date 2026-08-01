import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tizly.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    # Use absolute path for the service account
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    FIREBASE_SERVICE_ACCOUNT = os.path.join(BASE_DIR, 'firebase-service-account.json')