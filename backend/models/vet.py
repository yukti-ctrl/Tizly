from extensions import db
from datetime import datetime

class Vet(db.Model):
    __tablename__ = 'vets'
    id = db.Column(db.Integer, primary_key=True)
    # Link to the User account (role must be 'vet')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), default="General Care")
    bio = db.Column(db.Text)
    image_url = db.Column(db.Text)
    available_slots = db.Column(db.String(255), default="Mon-Fri: 9am - 5pm")

    appointments = db.relationship('VetAppointment', backref='vet', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

class VetAppointment(db.Model):
    __tablename__ = 'vet_appointments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vet_id = db.Column(db.Integer, db.ForeignKey('vets.id'), nullable=True)
    pet_name = db.Column(db.String(100), nullable=False)
    pet_type = db.Column(db.String(50), default="Dog")
    reason = db.Column(db.Text)
    preferred_date = db.Column(db.String(100), nullable=False)
    # status: pending, confirmed, completed, cancelled
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)