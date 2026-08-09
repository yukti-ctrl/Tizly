# Tizly — Full-Stack Pet Care & E-commerce Platform 🐾

Tizly is a comprehensive pet care ecosystem that combines a premium e-commerce shop, a vibrant pet-lover community, expert veterinary booking, and an AI-powered assistant. Built with a focus on modern UI/UX and scalable cloud architecture.

## 🚀 Features

- **E-commerce Shop:** Integrated cart system with "Guest-to-User" sync. Browse by category, search, and view detailed product specs.
- **Expert Vetcare:** Find certified veterinarians and book appointments for your furry friends.
- **Pet Community:** A social feed to share moments, like posts, and interact with other pet parents.
- **AI Chatbot:** Instant help for shipping, pet care tips, and navigation.
- **Secure Auth:** Powered by Firebase (Google Sign-In & Email/Password).
- **Hybrid Storage:** Local file handling for development, ready for AWS S3 migration.

## 🛠 Tech Stack

- **Frontend:** React + Vite, Axios, Lucide-React, React Router v7.
- **Backend:** Python Flask, Flask-SQLAlchemy, Flask-CORS.
- **Database:** SQLite (Dev) / PostgreSQL (Production via AWS RDS).
- **Authentication:** Firebase Admin SDK & Client SDK.
- **Deployment:** Docker, AWS ECS (Fargate), AWS S3/CloudFront.

---

## 💻 Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js (v18+)
- Firebase Project (Admin SDK JSON and Web Config)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py  #seed the database
python app.py #run the flask api based backend server
```
### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
