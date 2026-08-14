from flask import Blueprint, request, jsonify, g
from extensions import db
from models.product import Product, CartItem
from utils.decorators import login_required

# 1. DEFINE THE BLUEPRINT FIRST
product_bp = Blueprint('products', __name__)

# --- PRODUCT LISTING ROUTES ---

@product_bp.route('', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Product.query

    if category and category != 'All':
        query = query.filter(Product.category == category)
    if search:
        query = query.filter(Product.name.contains(search) | Product.description.contains(search))

    products = query.all()
    
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "category": p.category,
        "image_url": p.image_url,
        "rating": p.rating_avg,
        "description": p.description,
        "stock": p.stock_qty
    } for p in products]), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "category": product.category,
        "image_url": product.image_url,
        "stock": product.stock_qty
    }), 200

# --- SECURE CART ROUTES (FOR DEPLOYMENT) ---

@product_bp.route('/cart', methods=['GET'])
@login_required
def get_cart():
    try:
        items = CartItem.query.filter_by(user_id=g.user.id).all()
        cart_data = []
        
        for i in items:
            # Check if product actually exists to avoid NoneType errors
            if i.product:
                cart_data.append({
                    "id": i.id,
                    "product_id": i.product_id,
                    "name": i.product.name,
                    "price": i.product.price,
                    "quantity": i.quantity,
                    "image_url": i.product.image_url
                })
        
        return jsonify(cart_data), 200
    except Exception as e:
        print(f"Cart Fetch Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@product_bp.route('/cart', methods=['POST'])
@login_required
def add_to_cart():
    data = request.json
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    # Check if item already exists in this specific user's cart
    existing = CartItem.query.filter_by(user_id=g.user.id, product_id=product_id).first()
    
    if existing:
        existing.quantity += 1
    else:
        new_item = CartItem(user_id=g.user.id, product_id=product_id, quantity=1)
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"message": "Cart updated"}), 200

# backend/routes/product_routes.py

@product_bp.route('/cart/sync', methods=['POST'])
@login_required
def sync_cart():
    data = request.json
    local_items = data.get('items', [])
    
    try:
        for item in local_items:
            # Use 'product_id' or 'id' depending on how it was saved in localStorage
            p_id = item.get('product_id') or item.get('id')
            qty = item.get('quantity', 1)
            
            if not p_id: continue

            existing = CartItem.query.filter_by(user_id=g.user.id, product_id=p_id).first()
            if existing:
                existing.quantity += qty
            else:
                new_item = CartItem(user_id=g.user.id, product_id=p_id, quantity=qty)
                db.session.add(new_item)
                
        db.session.commit()
        return jsonify({"message": "Synced"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Sync Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@product_bp.route('/seller/add', methods=['POST'])
@login_required
def seller_add_product():
    # Security check: Ensure the logged-in user is actually a seller
    if g.user.role != 'seller':
        return jsonify({"error": "Unauthorized. Only sellers can list products."}), 403

    data = request.json
    try:
        new_product = Product(
            name=data.get('name'),
            price=float(data.get('price')),
            description=data.get('description'),
            category=data.get('category'),
            image_url=data.get('image_url') or "https://placehold.co/400x400?text=Pet+Product",
            seller_id=g.user.id # Link product to this user
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product created", "id": new_product.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

        
@product_bp.route('/cart/<int:item_id>', methods=['DELETE'])
@login_required
def remove_from_cart(item_id):
    item = CartItem.query.filter_by(id=item_id, user_id=g.user.id).first_or_404()
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 200