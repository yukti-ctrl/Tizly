from flask import Blueprint, request, jsonify
from extensions import db
from models.community import CommunityPost, PostComment

community_bp = Blueprint('community', __name__)

@community_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = CommunityPost.query.order_by(CommunityPost.created_at.desc()).all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "content": p.content,
        "image_url": p.image_url,
        "likes": p.likes_count,
        "author": p.author.name if p.author else "Anonymous",
        "date": p.created_at.strftime("%b %d")
    } for p in posts]), 200

@community_bp.route('/posts', methods=['POST'])
def create_post():
    # In final phase, we'll get user_id from auth
    data = request.json
    new_post = CommunityPost(
        user_id=1, # Temporary for dev
        title=data.get('title'),
        content=data.get('content'),
        image_url=data.get('image_url')
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"message": "Post created"}), 201