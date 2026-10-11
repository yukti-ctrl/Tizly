import React, { useState, useRef } from 'react';
import api from '../api/axios';
import { UploadCloud, CheckCircle, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function ImageUploader({ value, onChange, folder = 'products', label = 'Product Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [useUrlDirectly, setUseUrlDirectly] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      let returnedUrl = res.data.url;
      // If local fallback was used (/static/uploads/...), ensure full URL
      if (returnedUrl.startsWith('/')) {
        const rawBase = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? 'https://tizly.onrender.com' : 'http://127.0.0.1:5000');
        const backendBase = String(rawBase).trim().replace(/\/+$/, '');
        returnedUrl = `${backendBase}${returnedUrl}`;
      }

      onChange(returnedUrl);
    } catch (err) {
      console.error('Upload failed', err);
      setError('Upload failed. Please make sure backend is running or enter an image URL.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.labelRow}>
        <label style={styles.label}>{label}</label>
        <button
          type="button"
          style={styles.toggleBtn}
          onClick={() => setUseUrlDirectly(!useUrlDirectly)}
        >
          {useUrlDirectly ? <UploadCloud size={14} /> : <LinkIcon size={14} />}
          <span>{useUrlDirectly ? 'Upload File Instead' : 'Enter URL Instead'}</span>
        </button>
      </div>

      {useUrlDirectly ? (
        <input
          type="url"
          placeholder="https://example.com/pet-image.jpg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      ) : (
        <div
          style={styles.dropzone}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          {uploading ? (
            <div style={styles.statusBox}>
              <Loader2 className="spinner" size={24} color="#121212" />
              <span style={{ fontSize: '13px', marginTop: '6px' }}>Uploading to Supabase Storage...</span>
            </div>
          ) : value ? (
            <div style={styles.previewContainer}>
              <img src={value} alt="Preview" style={styles.previewImg} />
              <div style={styles.uploadedBadge}>
                <CheckCircle size={14} color="#2e7d32" />
                <span>Uploaded</span>
              </div>
            </div>
          ) : (
            <div style={styles.placeholderBox}>
              <UploadCloud size={28} color="#777" />
              <p style={{ margin: '6px 0 2px 0', fontWeight: '500', fontSize: '14px' }}>Click to upload image</p>
              <span style={{ fontSize: '12px', color: '#888' }}>Supports JPG, PNG, WEBP up to 16MB</span>
            </div>
          )}
        </div>
      )}

      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { marginBottom: '16px' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  toggleBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 },
  input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  dropzone: {
    border: '2px dashed #ddd',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'all 0.2s ease',
    minHeight: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statusBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555' },
  previewContainer: { position: 'relative', display: 'inline-block' },
  previewImg: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #eee' },
  uploadedBadge: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: '20px',
    padding: '3px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#2e7d32',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  errorText: { color: '#d32f2f', fontSize: '12px', marginTop: '6px' }
};
