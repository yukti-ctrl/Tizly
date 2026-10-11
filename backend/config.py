import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # 1. Supabase PostgreSQL Database URI (Fallback to SQLite in local dev)
    raw_db_url = (
        os.environ.get('SUPABASE_DB_URL') 
        or os.environ.get('DATABASE_URL') 
        or f"sqlite:///{os.path.join(BASE_DIR, 'tizly.db')}"
    )
    
    # SQLAlchemy requires 'postgresql://' instead of legacy 'postgres://'
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cloud connection pool resilience (prevents Supabase idle timeout disconnects)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    
    SECRET_KEY = os.environ.get('SECRET_KEY', 'tizly-super-secret-key-2026')
    
    # 2. Supabase Storage Configuration (for product and community images)
    SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
    SUPABASE_BUCKET = os.environ.get('SUPABASE_BUCKET', 'tizly-media')
    
    # 3. Local upload directory fallback if Supabase Storage is not yet configured
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 # 16 MB max image upload

    # 4. Firebase Service Account credentials path
    # Supports local development, Render secret file (/etc/secrets/), or custom env
    FIREBASE_SERVICE_ACCOUNT = os.environ.get(
        'FIREBASE_SERVICE_ACCOUNT_PATH',
        os.path.join(BASE_DIR, 'firebase-service-account.json')
    )