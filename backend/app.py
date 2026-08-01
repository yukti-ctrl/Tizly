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
    
    # 2. Initialize Firebase Admin SDK
    # This function is defined in extensions.py and looks for your .json file
    init_firebase(app)
    
    # 3. PROPER CORS SETUP
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

    # 4. Register Blueprints
    app.register_blueprint(product_bp, url_prefix='/products')
    app.register_blueprint(community_bp, url_prefix='/community')
    app.register_blueprint(vet_bp, url_prefix='/vets')
    app.register_blueprint(chatbot_bp, url_prefix='/chat')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    with app.app_context():
        # Import models here to ensure they are registered for table creation
        from models.user import User
        from models.product import Product, CartItem, WishlistItem
        from models.community import CommunityPost, PostComment
        from models.vet import Vet, VetAppointment
        db.create_all()

    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy", "database": "connected"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    # Run the server on port 5000
    app.run(debug=True, port=5000)