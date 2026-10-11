import os
import uuid
import requests
from werkzeug.utils import secure_filename
from config import Config

def upload_file_to_supabase(file_obj, original_filename, content_type=None, folder="products"):
    """
    Uploads a file to Supabase Storage bucket.
    If Supabase credentials are not configured, falls back to local static uploads folder.
    Returns: public URL string.
    """
    # Generate unique, safe filename
    base_name = secure_filename(original_filename) or "image.jpg"
    unique_name = f"{folder}/{uuid.uuid4().hex[:10]}_{base_name}"
    
    supabase_url = Config.SUPABASE_URL
    supabase_key = Config.SUPABASE_KEY
    bucket = Config.SUPABASE_BUCKET

    if supabase_url and supabase_key:
        try:
            # Supabase Storage REST API upload endpoint
            upload_endpoint = f"{supabase_url}/storage/v1/object/{bucket}/{unique_name}"
            headers = {
                "Authorization": f"Bearer {supabase_key}",
                "apikey": supabase_key,
                "Content-Type": content_type or "image/jpeg",
                "x-upsert": "true"
            }
            
            # Read file data
            file_data = file_obj.read()
            # Reset pointer in case needed again
            file_obj.seek(0)
            
            response = requests.post(upload_endpoint, headers=headers, data=file_data, timeout=15)
            
            if response.status_code in [200, 201]:
                # Construct public Supabase Storage CDN URL
                public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{unique_name}"
                print(f">>> Supabase Storage upload success: {public_url}")
                return public_url
            else:
                print(f"!!! Supabase upload returned {response.status_code}: {response.text}")
                # Fall back to local storage below
        except Exception as e:
            print(f"!!! Error uploading to Supabase Storage: {e}")
            # Fall back to local storage below
    
    # --- Local Fallback ---
    upload_dir = Config.UPLOAD_FOLDER
    os.makedirs(upload_dir, exist_ok=True)
    local_safe_filename = f"{uuid.uuid4().hex[:10]}_{base_name}"
    local_path = os.path.join(upload_dir, local_safe_filename)
    
    file_obj.seek(0)
    file_obj.save(local_path)
    print(f">>> Saved image to local storage: {local_path}")
    
    # Return local relative URL served by Flask static route
    return f"/static/uploads/{local_safe_filename}"
