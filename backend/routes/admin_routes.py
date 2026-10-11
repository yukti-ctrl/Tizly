from flask import Blueprint, request, jsonify, g
from extensions import db
from models.user import User
from models.product import Product
from models.community import CommunityPost
from models.vet import Vet, VetAppointment
from utils.decorators import roles_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
@roles_required('admin')
def get_admin_stats():
    """Admin dashboard stats overview."""
    total_users = User.query.count()
    total_products = Product.query.count()
    total_posts = CommunityPost.query.count()
    total_vets = Vet.query.count()
    total_appointments = VetAppointment.query.count()
    
    return jsonify({
        "total_users": total_users,
        "total_products": total_products,
        "total_posts": total_posts,
        "total_vets": total_vets,
        "total_appointments": total_appointments
    }), 200

@admin_bp.route('/users', methods=['GET'])
@roles_required('admin')
def get_users():
    """Admin: view all users and their roles."""
    users = User.query.order_by(User.id.asc()).all()
    return jsonify([{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role,
        "created_at": u.created_at.strftime("%Y-%m-%d") if u.created_at else "",
        "products_count": len(u.products),
        "posts_count": len(u.posts)
    } for u in users]), 200

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@roles_required('admin')
def change_user_role(user_id):
    """Admin: change any user's role to 'admin', 'vet', 'seller', or 'user'."""
    user = User.query.get_or_404(user_id)
    data = request.json or {}
    new_role = data.get('role')
    
    if new_role not in ['admin', 'vet', 'seller', 'user']:
        return jsonify({"error": "Invalid role. Choose from: admin, vet, seller, user"}), 400

    user.role = new_role
    
    # If promoting to vet, ensure Vet doctor profile exists
    if new_role == 'vet':
        existing_vet = Vet.query.filter_by(user_id=user.id).first()
        if not existing_vet:
            new_vet = Vet(
                user_id=user.id,
                name=user.name,
                specialization="General Care",
                bio="Certified Veterinary Professional."
            )
            db.session.add(new_vet)
            
    db.session.commit()
    return jsonify({
        "message": f"User {user.name} role changed to {new_role}",
        "user_id": user.id,
        "new_role": new_role
    }), 200
