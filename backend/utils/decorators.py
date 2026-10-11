from functools import wraps
from flask import request, jsonify, g
from firebase_admin import auth
from models.user import User

def get_authenticated_user():
    """Helper to extract and authenticate user from Authorization header."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, (jsonify({"error": "No token provided"}), 401)
    
    id_token = auth_header.split('Bearer ')[1].strip()
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        user = User.query.filter_by(firebase_uid=uid).first()
        if not user:
            return None, (jsonify({"error": "User not synchronized with database"}), 404)
        return user, None
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        return None, (jsonify({"error": "Invalid or expired token"}), 401)

def login_required(f):
    """Ensures that the request comes from an authenticated user of any role."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user, err_response = get_authenticated_user()
        if err_response:
            return err_response
        g.user = user
        return f(*args, **kwargs)
    return decorated_function

def roles_required(*allowed_roles):
    """
    Ensures that the authenticated user has one of the specified roles.
    Admins are superusers and always permitted.
    Allowed roles: 'admin', 'vet', 'seller', 'user'
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user, err_response = get_authenticated_user()
            if err_response:
                return err_response
            
            g.user = user
            
            # Admin can do everything
            if user.role == 'admin':
                return f(*args, **kwargs)
                
            if user.role not in allowed_roles:
                return jsonify({
                    "error": f"Forbidden. This action requires one of the following roles: {list(allowed_roles)}. Your current role is '{user.role}'."
                }), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator