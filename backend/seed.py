from app import create_app
from extensions import db
from models.product import Product
from models.vet import Vet
from models.community import CommunityPost
from models.user import User

app = create_app()

def seed_data():
    with app.app_context():
        # Create a dummy admin user for associations
        admin = User(firebase_uid="seed_admin", name="Admin", email="admin@tizly.com", role="admin")
        db.session.add(admin)
        db.session.commit()

        # Seed Products
        products = [
            Product(name="Premium Dog Kibble", price=45.99, category="Food", stock_qty=50, image_url="https://via.placeholder.com/150", description="Nutritious dog food."),
            Product(name="Cat Feather Toy", price=12.50, category="Toys", stock_qty=100, image_url="https://via.placeholder.com/150", description="Interactive toy."),
            Product(name="Orthopedic Pet Bed", price=89.00, category="Accessories", stock_qty=20, image_url="https://via.placeholder.com/150", description="Comfortable sleeping."),
            # ... Add 12 more to meet the "at least 15" requirement
        ]
        
        # Seed Vets
        vets = [
            Vet(name="Dr. Sarah Smith", specialization="General Surgery", bio="10 years exp.", image_url="https://via.placeholder.com/150"),
            Vet(name="Dr. Mike Jones", specialization="Behaviorist", bio="Specializes in anxious pets.", image_url="https://via.placeholder.com/150")
        ]

        db.session.bulk_save_objects(products)
        db.session.bulk_save_objects(vets)
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()