from flask import Blueprint, jsonify
from models.vet import Vet

vet_bp = Blueprint('vets', __name__)

@vet_bp.route('', methods=['GET'])
def get_vets():
    vets = Vet.query.all()
    return jsonify([{
        "id": v.id,
        "name": v.name,
        "specialization": v.specialization,
        "bio": v.bio,
        "image_url": v.image_url
    } for v in vets]), 200