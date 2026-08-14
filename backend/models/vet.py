from extensions import db

class Vet(db.Model):
    __tablename__ = 'vets'
    id = db.Column(db.Integer, primary_key=True)
    # Link to the User account (role must be 'vet')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100))
    bio = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    available_slots = db.Column(db.String(255))

class VetAppointment(db.Model):
    __tablename__ = 'vet_appointments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vet_id = db.Column(db.Integer, db.ForeignKey('vets.id'))
    pet_name = db.Column(db.String(100))
    pet_type = db.Column(db.String(50))
    reason = db.Column(db.Text)
    preferred_date = db.Column(db.String(100))
    status = db.Column(db.String(20), default='pending')