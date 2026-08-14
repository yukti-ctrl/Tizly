import React, { useState } from 'react';
import api from '../api/axios';
import { Plus, Package, CheckCircle, Loader2 } from 'lucide-react';

export default function SellerDashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState({
    name: '', price: '', category: 'Food', description: '', image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Endpoint we will create in backend in next step
      await api.post('/products/seller/add', product);
      setSuccess(true);
      setProduct({ name: '', price: '', category: 'Food', description: '', image_url: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={{marginBottom: '20px'}}>Seller Panel</h3>
      
      <div style={styles.card}>
        <h4 style={{marginBottom: '20px', display:'flex', alignItems:'center', gap:'10px'}}>
           <Plus size={20}/> List New Product
        </h4>

        {success && (
          <div style={styles.successMsg}>
            <CheckCircle size={18}/> Product listed successfully! It's now live in the shop.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Name</label>
            <input 
              style={styles.input} required value={product.name}
              onChange={e => setProduct({...product, name: e.target.value})} 
              placeholder="e.g. Organic Hemp Treats"
            />
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Price ($)</label>
              <input 
                type="number" step="0.01" style={styles.input} required value={product.price}
                onChange={e => setProduct({...product, price: e.target.value})} 
              />
            </div>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Category</label>
              <select 
                style={styles.input} value={product.category}
                onChange={e => setProduct({...product, category: e.target.value})}
              >
                <option>Food</option>
                <option>Toys</option>
                <option>Accessories</option>
                <option>Supplies</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea 
              style={{...styles.input, height: '100px', resize: 'none'}} required value={product.description}
              onChange={e => setProduct({...product, description: e.target.value})}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL</label>
            <input 
              style={styles.input} value={product.image_url}
              onChange={e => setProduct({...product, image_url: e.target.value})}
              placeholder="https://image-link.com/photo.jpg"
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20}/> : "List Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#888' },
  input: { padding: '12px 15px', borderRadius: '12px', border: '1px solid #eee', fontSize: '15px', outline: 'none' },
  row: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  submitBtn: { justifyContent: 'center', width: '100%', padding: '15px' },
  successMsg: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700' }
};