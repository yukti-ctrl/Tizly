from flask import Blueprint, request, jsonify, g
from extensions import db
from models.community import CommunityPost, PostComment
from utils.decorators import login_required

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
@login_required # SECURE
def create_post():
    data = request.json
    try:
        new_post = CommunityPost(
            user_id=g.user.id, # Using the ID from the verified token!
            title=data.get('title'),
            content=data.get('content'),
            image_url=data.get('image_url')
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({"message": "Post created successfully", "id": new_post.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500