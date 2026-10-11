from flask import Blueprint, request, jsonify, g
from extensions import db
from models.community import CommunityPost, PostComment
from utils.decorators import login_required

community_bp = Blueprint('community', __name__)

# --- 1. PUBLIC COMMUNITY FEED (NO AUTH REQUIRED) ---

@community_bp.route('/posts', methods=['GET'])
def get_posts():
    """Public: Anyone can view community posts."""
    posts = CommunityPost.query.order_by(CommunityPost.created_at.desc()).all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "content": p.content,
        "image_url": p.image_url,
        "likes": p.likes_count,
        "author_id": p.user_id,
        "author": p.author.name if p.author else "Pet Lover",
        "author_role": p.author.role if p.author else "user",
        "author_photo": p.author.photo_url if p.author else "",
        "date": p.created_at.strftime("%b %d, %Y"),
        "comment_count": len(p.comments) if p.comments else 0
    } for p in posts]), 200

@community_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Public: View single post with comments."""
    p = CommunityPost.query.get_or_404(post_id)
    return jsonify({
        "id": p.id,
        "title": p.title,
        "content": p.content,
        "image_url": p.image_url,
        "likes": p.likes_count,
        "author_id": p.user_id,
        "author": p.author.name if p.author else "Pet Lover",
        "author_role": p.author.role if p.author else "user",
        "author_photo": p.author.photo_url if p.author else "",
        "date": p.created_at.strftime("%b %d, %Y"),
        "comments": [{
            "id": c.id,
            "comment_text": c.comment_text,
            "author": c.commenter.name if c.commenter else "Anonymous",
            "author_role": c.commenter.role if c.commenter else "user",
            "date": c.created_at.strftime("%b %d, %Y")
        } for c in p.comments]
    }), 200

# --- 2. AUTHENTICATED ACTIONS (USER, VET, SELLER, ADMIN) ---

@community_bp.route('/posts', methods=['POST'])
@login_required
def create_post():
    """
    Allowed for all authenticated roles: user, vet, seller, admin.
    Vets, sellers, users, and admins can upload and include images.
    """
    data = request.json or {}
    title = data.get('title')
    content = data.get('content')
    
    if not title or not content:
        return jsonify({"error": "Title and Content are required"}), 400

    try:
        new_post = CommunityPost(
            user_id=g.user.id,
            title=title,
            content=content,
            image_url=data.get('image_url') # Supports Supabase Storage image URL
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({
            "message": "Post created successfully",
            "id": new_post.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@community_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    """
    Delete post.
    Allowed for: admin (can delete any post) OR author of the post.
    """
    post = CommunityPost.query.get_or_404(post_id)
    if g.user.role != 'admin' and post.user_id != g.user.id:
        return jsonify({"error": "Forbidden. You can only delete your own posts."}), 403

    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Post deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@community_bp.route('/posts/<int:post_id>/like', methods=['POST'])
@login_required
def like_post(post_id):
    """Any authenticated user can like a post."""
    post = CommunityPost.query.get_or_404(post_id)
    post.likes_count += 1
    db.session.commit()
    return jsonify({"message": "Liked", "likes": post.likes_count}), 200

@community_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@login_required
def add_comment(post_id):
    """Any authenticated user can comment on a post."""
    data = request.json or {}
    text = data.get('comment_text')
    if not text:
        return jsonify({"error": "Comment text required"}), 400

    post = CommunityPost.query.get_or_404(post_id)
    comment = PostComment(
        post_id=post.id,
        user_id=g.user.id,
        comment_text=text
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added", "id": comment.id}), 201