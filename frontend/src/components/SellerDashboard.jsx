import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ImageUploader from './ImageUploader';
import { Plus, Package, CheckCircle, Loader2, Trash2 } from 'lucide-react';

export default function SellerDashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [fetchingList, setFetchingList] = useState(true);

  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'Food',
    description: '',
    image_url: '',
    stock: 20
  });

  const fetchMyProducts = async () => {
    try {
      // Get all products and filter for this seller
      const res = await api.get('/products');
      setMyProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingList(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price) return;

    setLoading(true);
    try {
      await api.post('/products', {
        ...product,
        price: parseFloat(product.price)
      });
      setSuccess(true);
      setProduct({ name: '', price: '', category: 'Food', description: '', image_url: '', stock: 20 });
      fetchMyProducts();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: '800' }}>Seller Merchant Hub</h3>
      
      <div style={styles.card}>
        <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
          <Plus size={20} /> List New Pet or Vet Product
        </h4>

        {success && (
          <div style={styles.successMsg}>
            <CheckCircle size={18} /> Product listed successfully! It is now live across the public shop.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Name *</label>
            <input 
              style={styles.input} 
              required 
              value={product.name}
              onChange={e => setProduct({ ...product, name: e.target.value })} 
              placeholder="e.g. Organic Hemp Chews or Interactive Ball"
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Price ($) *</label>
              <input 
                type="number" 
                step="0.01" 
                style={styles.input} 
                required 
                value={product.price}
                onChange={e => setProduct({ ...product, price: e.target.value })} 
                placeholder="24.99"
              />
            </div>

            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Category</label>
              <select 
                style={styles.input}
                value={product.category}
                onChange={e => setProduct({ ...product, category: e.target.value })}
              >
                <option value="Food">Food & Nutrition</option>
                <option value="Vet Care">Vet Care (Health & Medical)</option>
                <option value="Toys">Toys & Play</option>
                <option value="Accessories">Accessories & Bedding</option>
                <option value="Supplies">Supplies & Hygiene</option>
              </select>
            </div>

            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Initial Stock</label>
              <input 
                type="number" 
                style={styles.input}
                value={product.stock}
                onChange={e => setProduct({ ...product, stock: e.target.value })} 
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea 
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              value={product.description}
              onChange={e => setProduct({ ...product, description: e.target.value })}
              placeholder="Key benefits, specifications, and sizing..."
            />
          </div>

          {/* SUPABASE STORAGE IMAGE UPLOAD */}
          <ImageUploader 
            folder="products"
            label="Product Photo (Supabase Storage)"
            value={product.image_url}
            onChange={url => setProduct({ ...product, image_url: url })}
          />

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? <Loader2 className="spinner" size={18} /> : 'List Product in Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  successMsg: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '12px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#333' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }
};