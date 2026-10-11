from flask import Blueprint, request, jsonify
from utils.decorators import login_required
from utils.supabase_storage import upload_file_to_supabase

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/image', methods=['POST'])
@login_required
def upload_image():
    """
    Accepts multipart/form-data with 'file' field and optional 'folder' parameter.
    Uploads directly to Supabase Storage (or local storage fallback).
    Returns JSON with the public URL.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded in 'file' field"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    folder = request.form.get('folder', 'products') # products, community, avatars
    content_type = file.content_type or 'image/jpeg'
    
    try:
        url = upload_file_to_supabase(file, file.filename, content_type=content_type, folder=folder)
        return jsonify({
            "url": url,
            "message": "Image uploaded successfully"
        }), 201
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500
