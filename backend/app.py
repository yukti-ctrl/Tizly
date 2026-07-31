from flask import Flask
from config import Config
from extensions import db, cors
from routes.product_routes import product_bp
from routes.community_routes import community_bp
from routes.vet_routes import vet_bp 
from routes.chatbot_routes import chatbot_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Extensions
    db.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    # Register Blueprints
    app.register_blueprint(product_bp, url_prefix='/products')
    app.register_blueprint(community_bp, url_prefix='/community')
    app.register_blueprint(vet_bp, url_prefix='/vets') # Added this
    app.register_blueprint(chatbot_bp, url_prefix='/chat')
    
    with app.app_context():
        # Import models here to ensure they are registered
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
    app.run(debug=True, port=5000)