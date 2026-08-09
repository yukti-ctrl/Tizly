from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, init_firebase
from routes.product_routes import product_bp
from routes.community_routes import community_bp
from routes.vet_routes import vet_bp 
from routes.chatbot_routes import chatbot_bp
from routes.auth_routes import auth_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 1. Initialize Extensions
    db.init_app(app)
    init_firebase(app)
    
    # 2. PROPER CORS SETUP
    CORS(app, resources={r"/*": {"origins": "*"}})

    # 3. Register Blueprints
    app.register_blueprint(product_bp, url_prefix='/products')
    app.register_blueprint(community_bp, url_prefix='/community')
    app.register_blueprint(vet_bp, url_prefix='/vets')
    app.register_blueprint(chatbot_bp, url_prefix='/chat')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    with app.app_context():
        from models.user import User
        from models.product import Product, CartItem, WishlistItem
        from models.community import CommunityPost, PostComment
        from models.vet import Vet, VetAppointment
        db.create_all()

        # --- AUTO-SEED LOGIC FOR AWS ---
        if Product.query.count() == 0:
            print("Database empty. Seeding initial data...")
            p1 = Product(name="Premium Dog Kibble", price=45.99, category="Food", image_url="https://placehold.co/400x400?text=Dog+Food", description="Nutritious food.")
            p2 = Product(name="Cat Feather Toy", price=12.50, category="Toys", image_url="https://placehold.co/400x400?text=Cat+Toy", description="Fun toy.")
            v1 = Vet(name="Dr. Sarah Smith", specialization="Surgery", bio="10 years exp.", image_url="https://placehold.co/200x200?text=Dr+Sarah")
            db.session.add_all([p1, p2, v1])
            db.session.commit()
            print("Seeding complete.")

    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy", "database": "connected"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)