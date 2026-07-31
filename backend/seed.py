from app import create_app
from extensions import db
from models.product import Product
from models.vet import Vet
from models.community import CommunityPost
from models.user import User

app = create_app()

def seed_data():
    with app.app_context():
        print("Clearing database...")
        db.drop_all()
        db.create_all()

        print("Seeding new data...")
        # 1. Create a dummy admin user
        admin = User(
            firebase_uid="seed_admin", 
            name="Admin", 
            email="admin@tizly.com", 
            role="admin"
        )
        db.session.add(admin)
        db.session.commit() # Commit to get the admin.id for associations

        # 2. Seed Products
        products = [
            Product(name="Premium Dog Kibble", price=45.99, category="Food", stock_qty=50, image_url="https://placehold.co/400x400?text=Dog+Food", description="Nutritious dog food."),
            Product(name="Cat Feather Toy", price=12.50, category="Toys", stock_qty=100, image_url="https://placehold.co/400x400?text=Cat+Toy", description="Interactive toy."),
            Product(name="Orthopedic Pet Bed", price=89.00, category="Accessories", stock_qty=20, image_url="https://placehold.co/400x400?text=Pet+Bed", description="Comfortable sleeping."),
            Product(name="Organic Rabbit Treats", price=15.00, category="Food", stock_qty=40, image_url="https://placehold.co/400x400?text=Treats", description="Healthy snacks."),
            Product(name="Silent Water Fountain", price=35.99, category="Supplies", stock_qty=15, image_url="https://placehold.co/400x400?text=Fountain", description="Fresh water for pets."),
        ]
        
        # Adding more products to reach 15
        for i in range(6, 16):
            products.append(Product(
                name=f"Pet Supply {i}", 
                price=10.0 + i, 
                category="Misc", 
                stock_qty=20, 
                image_url=f"https://placehold.co/400x400?text=Item+{i}",
                description="Quality pet essential."
            ))

        # 3. Seed Vets
        vets = [
            Vet(name="Dr. Sarah Smith", specialization="General Surgery", bio="10 years exp.", image_url="https://placehold.co/200x200?text=Dr+Sarah"),
            Vet(name="Dr. Mike Jones", specialization="Behaviorist", bio="Specializes in anxious pets.", image_url="https://placehold.co/200x200?text=Dr+Mike")
        ]

        # 4. Seed Community Posts
        posts = [
            CommunityPost(user_id=admin.id, title="My new puppy!", content="He is so energetic and loves the new kibble from the shop!", image_url="https://placehold.co/600x400?text=Puppy"),
            CommunityPost(user_id=admin.id, title="Training tips?", content="Anyone have advice for leash training a golden retriever?", image_url="https://placehold.co/600x400?text=Dog+Training")
        ]

        db.session.bulk_save_objects(products)
        db.session.bulk_save_objects(vets)
        db.session.bulk_save_objects(posts)
        db.session.commit()
        
        print("Database seeded successfully with 15 products, 2 vets, and 2 community posts!")

if __name__ == '__main__':
    seed_data()