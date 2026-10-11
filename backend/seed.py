from app import create_app
from extensions import db
from models.product import Product
from models.vet import Vet, VetAppointment
from models.community import CommunityPost
from models.user import User

app = create_app()

def seed_data():
    with app.app_context():
        print("Clearing and recreating database schema...")
        db.drop_all()
        db.create_all()

        print("Seeding sample data for all 4 roles...")
        
        # 1. Admin User
        admin = User(
            firebase_uid="seed_admin", 
            name="Tizly Administrator", 
            email="admin@tizly.com", 
            role="admin",
            photo_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
        )
        
        # 2. Vet User (Doctor)
        vet_user = User(
            firebase_uid="seed_vet_sarah",
            name="Dr. Sarah Jenkins",
            email="sarah.vet@tizly.com",
            role="vet",
            photo_url="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
        )
        
        # 3. Seller User
        seller_user = User(
            firebase_uid="seed_seller_paws",
            name="Pawfect Pet Supplies",
            email="seller@pawfect.com",
            role="seller",
            photo_url="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
        )

        # 4. Regular User (Pet Parent)
        regular_user = User(
            firebase_uid="seed_parent_alex",
            name="Alex Morgan",
            email="alex@gmail.com",
            role="user",
            photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
        )

        db.session.add_all([admin, vet_user, seller_user, regular_user])
        db.session.commit()

        # 5. Doctor Vet Profile
        vet_profile = Vet(
            user_id=vet_user.id,
            name=vet_user.name,
            specialization="Clinical Nutrition & Dermatology",
            bio="Certified DVM with 10+ years helping pets thrive on wholesome diets and medical care.",
            image_url=vet_user.photo_url,
            available_slots="Mon - Fri: 10:00 AM - 4:00 PM"
        )
        db.session.add(vet_profile)
        db.session.commit()

        # 6. Seed Products (General + Vet Care)
        products = [
            Product(
                name="Veterinary Oral Dental Hygiene Kit", 
                price=24.50, 
                category="Vet Care", 
                stock_qty=40,
                seller_id=vet_user.id,
                image_url="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop&q=80", 
                description="Clinically formulated enzyme toothpaste with ultra-soft ergonomic toothbrush."
            ),
            Product(
                name="Herbal Calming Drops for Anxious Pets", 
                price=32.00, 
                category="Vet Care", 
                stock_qty=25,
                seller_id=vet_user.id,
                image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80", 
                description="Botanical valerian and chamomile tincture to ease travel stress and separation anxiety."
            ),
            Product(
                name="Organic Salmon & Sweet Potato Kibble", 
                price=49.99, 
                category="Food", 
                stock_qty=50,
                seller_id=seller_user.id,
                image_url="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80", 
                description="Grain-free, wild-caught salmon rich in essential omega fatty acids."
            ),
            Product(
                name="Interactive Laser Feather Spinner", 
                price=18.50, 
                category="Toys", 
                stock_qty=30,
                seller_id=seller_user.id,
                image_url="https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&auto=format&fit=crop&q=80", 
                description="Keeps indoor cats engaged with randomized rotational patterns."
            ),
            Product(
                name="Orthopedic Memory Foam Pet Bed", 
                price=85.00, 
                category="Accessories", 
                stock_qty=15,
                seller_id=admin.id,
                image_url="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400&auto=format&fit=crop&q=80", 
                description="Ergonomic memory foam relieves joint pressure for senior dogs."
            )
        ]
        db.session.add_all(products)

        # 7. Seed Community Posts
        posts = [
            CommunityPost(
                user_id=vet_user.id, 
                title="Vet Tip: Recognizing early signs of pet dehydration", 
                content="As temperatures rise, make sure to check your pet's gums and skin elasticity. Always keep clean, shaded water stations available!", 
                image_url="https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&auto=format&fit=crop&q=80",
                likes_count=14
            ),
            CommunityPost(
                user_id=regular_user.id, 
                title="Buster loving his new orthopedic bed!", 
                content="He hasn't left this bed since we unpacked it yesterday. Best purchase of the month!", 
                image_url="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
                likes_count=9
            )
        ]
        db.session.add_all(posts)
        db.session.commit()
        
        print("Database successfully seeded with 4 roles, products, vet profile, and community posts!")

if __name__ == '__main__':
    seed_data()