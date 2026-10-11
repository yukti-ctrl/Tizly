import os
from flask import Blueprint, request, jsonify, g
from firebase_admin import auth
from extensions import db
from models.user import User
from models.vet import Vet
from utils.decorators import login_required

auth_bp = Blueprint('auth', __name__)

ADMIN_SECRET = os.environ.get('ADMIN_REGISTRATION_CODE', 'TIZLY_ADMIN_2026')

def get_admin_uids():
    """
    Dynamically loads admin UIDs from environment variables (hidden in .env).
    Supports comma-separated string, e.g.: ADMIN_UIDS=uid1,uid2
    """
    raw_uids = os.environ.get('ADMIN_UIDS', '')
    return set(filter(None, [uid.strip() for uid in raw_uids.split(',')]))

@auth_bp.route('/verify', methods=['POST', 'OPTIONS'])
def verify_token():
    """
    Verifies Firebase ID token, synchronizes user with Supabase database,
    and returns complete user profile with role.
    """
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or {}
    token = data.get('idToken')
    requested_role = data.get('role', 'user')
    admin_code = data.get('adminCode', '')

    if not token:
        return jsonify({"error": "No token provided"}), 400

    try:
        # 1. Verify token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get('uid')
        email = decoded_token.get('email', '') or ''
        picture = decoded_token.get('picture', '') or ''

        if not uid:
            return jsonify({"error": "Invalid token payload: missing uid"}), 401

        admin_uids = get_admin_uids()

        # 2. Resolve user role
        if uid in admin_uids:
            final_role = 'admin'
        elif requested_role == 'admin':
            if admin_code == ADMIN_SECRET or (email and email.startswith('admin@')):
                final_role = 'admin'
            else:
                final_role = 'user'
        elif requested_role in ['vet', 'seller', 'user']:
            final_role = requested_role
        else:
            final_role = 'user'

        # 3. Clean Display Name resolution (supports Google display name, email, or fallback)
        raw_name = decoded_token.get('name')
        if raw_name and raw_name.strip():
            display_name = raw_name.strip()
        elif email and '@' in email:
            display_name = email.split('@')[0].capitalize()
        elif final_role == 'admin':
            display_name = 'Admin'
        else:
            display_name = 'Pet Lover'

        # 4. Find existing user by firebase_uid, or by email to avoid unique constraint collisions
        user = User.query.filter_by(firebase_uid=uid).first()
        if not user and email:
            user = User.query.filter_by(email=email).first()
            if user:
                user.firebase_uid = uid

        if not user:
            # Create new user record
            user = User(
                firebase_uid=uid,
                email=email or f"{uid[:10]}@tizly.internal",
                name=display_name,
                role=final_role,
                photo_url=picture
            )
            db.session.add(user)
            db.session.flush() # Generates user.id cleanly before creating child records

            # If user is a Vet doctor, automatically initialize doctor profile
            if final_role == 'vet':
                new_vet = Vet(
                    user_id=user.id,
                    name=user.name,
                    specialization="General Care",
                    image_url=user.photo_url or "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop&q=80",
                    bio="Certified Veterinary Professional dedicated to pet care."
                )
                db.session.add(new_vet)

            db.session.commit()
        else:
            updated = False

            # If UID is in ADMIN_UIDS, enforce admin role
            if uid in admin_uids and user.role != 'admin':
                user.role = 'admin'
                updated = True
            elif final_role != 'user' and user.role == 'user':
                user.role = final_role
                updated = True

            # Sync name if missing or default
            if (not user.name or user.name == 'Pet Lover') and display_name and display_name != 'Pet Lover':
                user.name = display_name
                updated = True

            # Sync picture from Firebase if missing
            if not user.photo_url and picture:
                user.photo_url = picture
                updated = True

            # If user is a vet, ensure doctor profile exists
            if user.role == 'vet':
                existing_vet = Vet.query.filter_by(user_id=user.id).first()
                if not existing_vet:
                    new_vet = Vet(
                        user_id=user.id,
                        name=user.name,
                        specialization="General Care",
                        image_url=user.photo_url or "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop&q=80",
                        bio="Certified Veterinary Professional dedicated to pet care."
                    )
                    db.session.add(new_vet)
                    updated = True

            if updated:
                db.session.commit()

        return jsonify({
            "id": user.id,
            "uid": user.firebase_uid,
            "name": user.name or display_name,
            "displayName": user.name or display_name,
            "role": user.role,
            "email": user.email,
            "photo_url": user.photo_url or picture,
            "photoURL": user.photo_url or picture
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Auth sync error: {str(e)}")
        return jsonify({"error": str(e)}), 401

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Returns currently authenticated user profile from token."""
    return jsonify({
        "id": g.user.id,
        "uid": g.user.firebase_uid,
        "name": g.user.name,
        "displayName": g.user.name,
        "role": g.user.role,
        "email": g.user.email,
        "photo_url": g.user.photo_url,
        "photoURL": g.user.photo_url
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    """Updates user profile and synchronizes with Firebase Auth."""
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    photo_url = data.get('photo_url') or data.get('photoURL')

    try:
        if name and name.strip():
            g.user.name = name.strip()
        if photo_url:
            g.user.photo_url = photo_url

        db.session.commit()

        # Update in Firebase Auth as well
        try:
            update_kwargs = {}
            if name and name.strip(): 
                update_kwargs['display_name'] = name.strip()
            if photo_url: 
                update_kwargs['photo_url'] = photo_url
            if update_kwargs:
                auth.update_user(g.user.firebase_uid, **update_kwargs)
        except Exception as fb_err:
            print(f"Firebase profile sync warning: {fb_err}")

        return jsonify({
            "message": "Profile updated successfully",
            "id": g.user.id,
            "uid": g.user.firebase_uid,
            "name": g.user.name,
            "displayName": g.user.name,
            "role": g.user.role,
            "email": g.user.email,
            "photo_url": g.user.photo_url,
            "photoURL": g.user.photo_url
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500