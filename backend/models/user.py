from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Roles: 'admin', 'vet', 'seller', 'user'
    role = db.Column(db.String(20), default='user') 
    photo_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship('CommunityPost', backref='author', lazy=True, cascade="all, delete-orphan")
    products = db.relationship('Product', backref='seller', lazy=True)
    vet_profile = db.relationship('Vet', backref='user_account', uselist=False, cascade="all, delete-orphan")
    appointments = db.relationship('VetAppointment', backref='patient_user', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)