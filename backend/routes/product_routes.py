from flask import Blueprint, request, jsonify
from models.product import Product

product_bp = Blueprint('products', __name__)

@product_bp.route('', methods=['GET'])
def get_products():
    # Query parameters
    category = request.args.get('category')
    search = request.args.get('search')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort = request.args.get('sort') # 'price_low', 'price_high', 'newest'

    query = Product.query

    if category:
        query = query.filter(Product.category == category)
    if search:
        query = query.filter(Product.name.contains(search) | Product.description.contains(search))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort == 'price_low':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_high':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    products = query.all()
    
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "category": p.category,
        "image_url": p.image_url,
        "rating": p.rating_avg,
        "description": p.description
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