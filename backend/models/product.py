from extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    # Categories include: "Food", "Toys", "Vet Care", "Medical", "Supplies", "Accessories", "Grooming"
    category = db.Column(db.String(50), default="General")
    stock_qty = db.Column(db.Integer, default=10)
    image_url = db.Column(db.Text) # Text to support full Supabase Storage CDN URLs
    rating_avg = db.Column(db.Float, default=4.8)
    
    # Track which user listed the product (admin, seller, or vet)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    cart_items = db.relationship('CartItem', back_populates='product', cascade="all, delete-orphan")
    wishlist_items = db.relationship('WishlistItem', back_populates='product', cascade="all, delete-orphan")

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    product = db.relationship('Product', back_populates='cart_items')

class WishlistItem(db.Model):
    __tablename__ = 'wishlist_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product = db.relationship('Product', back_populates='wishlist_items')