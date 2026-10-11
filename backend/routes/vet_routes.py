from flask import Blueprint, request, jsonify, g
from extensions import db
from models.vet import Vet, VetAppointment
from utils.decorators import login_required, roles_required

vet_bp = Blueprint('vets', __name__)

# --- 1. PUBLIC VET DIRECTORY (NO AUTH REQUIRED) ---

@vet_bp.route('', methods=['GET'])
def get_vets():
    """Public: Anyone can browse certified veterinarians."""
    vets = Vet.query.all()
    return jsonify([{
        "id": v.id,
        "user_id": v.user_id,
        "name": v.name,
        "specialization": v.specialization or "General Care",
        "bio": v.bio or "Certified Veterinary Specialist dedicated to pet health.",
        "image_url": v.image_url or "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop&q=80",
        "available_slots": v.available_slots or "Mon - Fri, 9 AM - 5 PM"
    } for v in vets]), 200

# --- 2. APPOINTMENTS (AUTHENTICATED) ---

@vet_bp.route('/appointments', methods=['POST'])
@login_required
def book_appointment():
    """Any authenticated user can book a vet appointment."""
    data = request.json or {}
    pet_name = data.get('pet_name')
    preferred_date = data.get('preferred_date')
    
    if not pet_name or not preferred_date:
        return jsonify({"error": "Pet name and preferred date are required"}), 400

    try:
        new_app = VetAppointment(
            user_id=g.user.id,
            vet_id=data.get('vet_id'),
            pet_name=pet_name,
            pet_type=data.get('pet_type', 'Dog'),
            reason=data.get('reason', 'Routine Checkup'),
            preferred_date=preferred_date,
            status='pending'
        )
        db.session.add(new_app)
        db.session.commit()
        return jsonify({
            "message": "Appointment booked successfully",
            "id": new_app.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@vet_bp.route('/appointments', methods=['GET'])
@login_required
def get_appointments():
    """
    Returns appointments based on user role:
    - Vet: appointments booked with this vet doctor.
    - Admin: all appointments.
    - User/Seller: appointments booked by this user.
    """
    query = VetAppointment.query

    if g.user.role == 'admin':
        appointments = query.order_by(VetAppointment.created_at.desc()).all()
    elif g.user.role == 'vet':
        vet_profile = Vet.query.filter_by(user_id=g.user.id).first()
        if vet_profile:
            appointments = query.filter_by(vet_id=vet_profile.id).order_by(VetAppointment.created_at.desc()).all()
        else:
            appointments = []
    else:
        # Regular user or seller seeing their own pet appointments
        appointments = query.filter_by(user_id=g.user.id).order_by(VetAppointment.created_at.desc()).all()

    return jsonify([{
        "id": a.id,
        "pet_name": a.pet_name,
        "pet_type": a.pet_type,
        "reason": a.reason,
        "preferred_date": a.preferred_date,
        "status": a.status,
        "vet_name": a.vet.name if a.vet else "Assigned Specialist",
        "patient_name": a.patient_user.name if a.patient_user else "Patient",
        "patient_email": a.patient_user.email if a.patient_user else ""
    } for a in appointments]), 200

@vet_bp.route('/appointments/<int:app_id>/status', methods=['PUT'])
@roles_required('admin', 'vet')
def update_appointment_status(app_id):
    """Vets and admins can update appointment status (confirmed, completed, cancelled)."""
    appointment = VetAppointment.query.get_or_404(app_id)
    data = request.json or {}
    new_status = data.get('status')
    
    if new_status not in ['pending', 'confirmed', 'completed', 'cancelled']:
        return jsonify({"error": "Invalid status"}), 400

    appointment.status = new_status
    db.session.commit()
    return jsonify({"message": f"Appointment status updated to {new_status}"}), 200

@vet_bp.route('/profile', methods=['PUT'])
@roles_required('admin', 'vet')
def update_vet_profile():
    """Vets can update their doctor profile bio, specialization, and image."""
    vet_profile = Vet.query.filter_by(user_id=g.user.id).first()
    if not vet_profile:
        # Create if not exists
        vet_profile = Vet(user_id=g.user.id, name=g.user.name)
        db.session.add(vet_profile)

    data = request.json or {}
    if 'name' in data: vet_profile.name = data['name']
    if 'specialization' in data: vet_profile.specialization = data['specialization']
    if 'bio' in data: vet_profile.bio = data['bio']
    if 'image_url' in data: vet_profile.image_url = data['image_url']
    if 'available_slots' in data: vet_profile.available_slots = data['available_slots']

    db.session.commit()
    return jsonify({"message": "Doctor profile updated successfully"}), 200