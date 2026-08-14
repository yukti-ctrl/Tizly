from flask import Blueprint, request, jsonify
from firebase_admin import auth
from extensions import db
from models.user import User
from models.vet import Vet

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/verify', methods=['POST'])
def verify_token():
    data = request.get_json()
    token = data.get('idToken')
    # Role is sent from frontend only during signup
    requested_role = data.get('role', 'user') 

    if not token:
        return jsonify({"error": "No token provided"}), 400

    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        user = User.query.filter_by(firebase_uid=uid).first()
        
        if not user:
            # Create new user in local DB
            user = User(
                firebase_uid=uid,
                email=decoded_token.get('email'),
                name=decoded_token.get('name', 'Pet Lover'),
                role=requested_role,
                photo_url=decoded_token.get('picture', '')
            )
            db.session.add(user)
            db.session.commit()

            # If signing up as a Vet, create the base profile
            if requested_role == 'vet':
                new_vet = Vet(
                    user_id=user.id, 
                    name=user.name, 
                    specialization="General Care",
                    image_url=user.photo_url or "https://placehold.co/200x200?text=Vet",
                    bio="Certified Veterinary Professional."
                )
                db.session.add(new_vet)
                db.session.commit()

        return jsonify({
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "email": user.email
        }), 200
    except Exception as e:
        print(f"Auth sync error: {str(e)}")
        return jsonify({"error": str(e)}), 401