from flask import Blueprint, request, jsonify
from firebase_admin import auth
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/verify', methods=['POST'])
def verify_token():
    data = request.get_json()
    token = data.get('idToken')

    if not token:
        print("Backend Error: No token received from frontend")
        return jsonify({"error": "No token provided"}), 400

    try:
        # 1. Verify the token with Firebase
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        print(f"Verified Firebase UID: {uid}") # Debug log

        # 2. Sync with database
        user = User.query.filter_by(firebase_uid=uid).first()
        if not user:
            email = decoded_token.get('email')
            name = decoded_token.get('name', 'Pet Lover')
            user = User(firebase_uid=uid, email=email, name=name)
            db.session.add(user)
            db.session.commit()
            print(f"Created new user in DB: {email}")

        return jsonify({
            "id": user.id,
            "name": user.name,
            "role": user.role
        }), 200

    except Exception as e:
        # THIS PRINT WILL TELL US EXACTLY WHAT IS WRONG
        print(f"Backend Auth Error: {str(e)}") 
        return jsonify({"error": str(e)}), 401