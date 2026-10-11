from flask import Blueprint, request, jsonify, g
from extensions import db
from models.product import Product, CartItem
from utils.decorators import login_required, roles_required

product_bp = Blueprint('products', __name__)

# --- 1. PUBLIC PRODUCT CATALOG (NO AUTH REQUIRED) ---

@product_bp.route('', methods=['GET'])
def get_products():
    """Public: Anyone can view and search products."""
    category = request.args.get('category')
    search = request.args.get('search')
    seller_id = request.args.get('seller_id')
    
    query = Product.query

    if category and category.lower() != 'all':
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if search:
        search_filter = f"%{search}%"
        query = query.filter(Product.name.ilike(search_filter) | Product.description.ilike(search_filter))
    if seller_id:
        query = query.filter(Product.seller_id == int(seller_id))

    products = query.order_by(Product.id.desc()).all()
    
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "category": p.category,
        "image_url": p.image_url,
        "rating": p.rating_avg,
        "description": p.description,
        "stock": p.stock_qty,
        "seller_id": p.seller_id,
        "seller_name": p.seller.name if p.seller else "Tizly Official",
        "seller_role": p.seller.role if p.seller else "admin"
    } for p in products]), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Public: Anyone can view product details."""
    product = Product.query.get_or_404(product_id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "category": product.category,
        "image_url": product.image_url,
        "stock": product.stock_qty,
        "rating": product.rating_avg,
        "seller_id": product.seller_id,
        "seller_name": product.seller.name if product.seller else "Tizly Official",
        "seller_role": product.seller.role if product.seller else "admin"
    }), 200

# --- 2. PRODUCT MANAGEMENT (ADMIN, VET, SELLER) ---

@product_bp.route('', methods=['POST'])
@roles_required('admin', 'seller', 'vet')
def create_product():
    """
    Allowed for: admin, seller, vet.
    Vets can add vet care products and supplies; sellers can add retail/pet products; admins can add anything.
    """
    data = request.json or {}
    name = data.get('name')
    price = data.get('price')
    
    if not name or price is None:
        return jsonify({"error": "Name and Price are required"}), 400

    try:
        category = data.get('category') or ('Vet Care' if g.user.role == 'vet' else 'General')
        
        new_product = Product(
            name=name,
            price=float(price),
            description=data.get('description', ''),
            category=category,
            stock_qty=int(data.get('stock', 10)),
            image_url=data.get('image_url') or "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80",
            seller_id=g.user.id
        )
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify({
            "message": "Product created successfully",
            "id": new_product.id,
            "product": {
                "id": new_product.id,
                "name": new_product.name,
                "price": new_product.price,
                "category": new_product.category,
                "image_url": new_product.image_url
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['PUT'])
@login_required
def update_product(product_id):
    """
    Update product.
    Allowed for: admin (can edit any) OR seller/vet who created this product.
    """
    product = Product.query.get_or_404(product_id)
    
    # Ownership or Admin check
    if g.user.role != 'admin' and product.seller_id != g.user.id:
        return jsonify({"error": "Forbidden. You can only edit your own products."}), 403

    data = request.json or {}
    try:
        if 'name' in data: product.name = data['name']
        if 'price' in data: product.price = float(data['price'])
        if 'description' in data: product.description = data['description']
        if 'category' in data: product.category = data['category']
        if 'stock' in data: product.stock_qty = int(data['stock'])
        if 'image_url' in data: product.image_url = data['image_url']
        
        db.session.commit()
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['DELETE'])
@login_required
def delete_product(product_id):
    """
    Delete product.
    Allowed for: admin (can delete any) OR seller/vet who created this product.
    """
    product = Product.query.get_or_404(product_id)
    
    if g.user.role != 'admin' and product.seller_id != g.user.id:
        return jsonify({"error": "Forbidden. You can only delete your own products."}), 403

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Legacy route alias for existing frontend compatibility
@product_bp.route('/seller/add', methods=['POST'])
@roles_required('admin', 'seller', 'vet')
def legacy_seller_add():
    return create_product()

# --- 3. CART ROUTES (AUTHENTICATED) ---

@product_bp.route('/cart', methods=['GET'])
@login_required
def get_cart():
    try:
        items = CartItem.query.filter_by(user_id=g.user.id).all()
        cart_data = []
        for i in items:
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
        return jsonify({"error": str(e)}), 500

@product_bp.route('/cart', methods=['POST'])
@login_required
def add_to_cart():
    data = request.json or {}
    product_id = data.get('product_id')
    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    existing = CartItem.query.filter_by(user_id=g.user.id, product_id=product_id).first()
    if existing:
        existing.quantity += data.get('quantity', 1)
    else:
        new_item = CartItem(user_id=g.user.id, product_id=product_id, quantity=data.get('quantity', 1))
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"message": "Cart updated"}), 200

@product_bp.route('/cart/sync', methods=['POST'])
@login_required
def sync_cart():
    data = request.json or {}
    local_items = data.get('items', [])
    try:
        for item in local_items:
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
        return jsonify({"message": "Cart synchronized"}), 200
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