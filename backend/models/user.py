from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    role = db.Column(db.String(20), default='user') # user, admin, vet
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship('CommunityPost', backref='author', lazy=True)