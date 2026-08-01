from functools import wraps
from flask import request, jsonify, g
from firebase_admin import auth
from models.user import User

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "No token provided"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        
        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Find the user in our local SQLite DB
            user = User.query.filter_by(firebase_uid=uid).first()
            if not user:
                return jsonify({"error": "User not synchronized with database"}), 404
            
            # Store the user in 'g' (global request context) for the routes to use
            g.user = user
            
        except Exception as e:
            print(f"Token verification failed: {str(e)}")
            return jsonify({"error": "Invalid or expired token"}), 401
            
        return f(*args, **kwargs)
    return decorated_function