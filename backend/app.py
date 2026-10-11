import os
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from config import Config
from extensions import db, init_firebase
from routes.product_routes import product_bp
from routes.community_routes import community_bp
from routes.vet_routes import vet_bp 
from routes.chatbot_routes import chatbot_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.upload_routes import upload_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    init_firebase(app)
    
    # 1. Primary CORS Configuration
    CORS(app, resources={r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "expose_headers": ["Content-Type", "Authorization"]
    }})

    # 2. Bulletproof CORS headers on every response (guarantees error responses don't fail CORS)
    @app.after_request
    def apply_cors_headers(response):
        origin = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Origin'] = origin if origin else '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return response

    # 3. Explicit OPTIONS preflight handler
    @app.before_request
    def handle_options_preflight():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            origin = request.headers.get('Origin', '*')
            response.headers['Access-Control-Allow-Origin'] = origin if origin else '*'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            return response

    # 4. Root Welcome Route
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            "service": "Tizly Pet Care & E-Commerce API",
            "status": "online",
            "health_check": "/health",
            "environment": "production" if "postgres" in app.config.get('SQLALCHEMY_DATABASE_URI', '') else "development"
        }), 200

    # 5. Health Check Endpoint for Render Zero-Downtime Monitoring
    @app.route('/health', methods=['GET'])
    def health_check():
        db_type = "PostgreSQL (Supabase)" if "postgres" in app.config.get('SQLALCHEMY_DATABASE_URI', '') else "SQLite (Local Dev)"
        return jsonify({
            "status": "healthy",
            "database": db_type,
            "supabase_storage": bool(app.config.get('SUPABASE_URL'))
        }), 200

    # 6. Local uploads route for static image serving fallback
    @app.route('/static/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # 7. Register blueprints
    app.register_blueprint(product_bp, url_prefix='/products')
    app.register_blueprint(community_bp, url_prefix='/community')
    app.register_blueprint(vet_bp, url_prefix='/vets')
    app.register_blueprint(chatbot_bp, url_prefix='/chat')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(upload_bp, url_prefix='/upload')
    
    with app.app_context():
        from models.user import User
        from models.product import Product, CartItem, WishlistItem
        from models.community import CommunityPost, PostComment
        from models.vet import Vet, VetAppointment
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    # Support dynamic PORT on Render or local port 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')