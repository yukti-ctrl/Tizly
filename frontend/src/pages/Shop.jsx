import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ImageUploader from '../components/ImageUploader';
import { Search, Loader2, Plus, X, Stethoscope, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['All', 'Vet Care', 'Food', 'Toys', 'Accessories', 'Supplies'];

export default function Shop() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Food',
    description: '',
    image_url: '',
    stock: 15
  });

  const canAddProduct = user && ['admin', 'seller', 'vet'].includes(user.role);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?search=${encodeURIComponent(search)}`;
      if (selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const res = await api.get(url);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    setSubmitting(true);
    try {
      await api.post('/products', {
        ...newProduct,
        price: parseFloat(newProduct.price),
        category: user.role === 'vet' && newProduct.category === 'Food' ? 'Vet Care' : newProduct.category
      });
      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        category: user.role === 'vet' ? 'Vet Care' : 'Food',
        description: '',
        image_url: '',
        stock: 15
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to list product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Tizly Shop</h1>
          <p style={styles.subtitle}>Premium pet care, certified nutrition, and vet-approved essentials.</p>
        </div>

        <div style={styles.headerActions}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input 
              style={styles.searchInput} 
              placeholder="Search products, medications, food..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {canAddProduct && (
            <button 
              className="btn-primary" 
              style={styles.addBtn}
              onClick={() => {
                setNewProduct(prev => ({
                  ...prev,
                  category: user.role === 'vet' ? 'Vet Care' : 'Food'
                }));
                setShowAddModal(true);
              }}
            >
              {user.role === 'vet' ? <Stethoscope size={18} /> : <Plus size={18} />}
              <span>{user.role === 'vet' ? 'Add Vet Care Product' : 'List Product'}</span>
            </button>
          )}
        </div>
      </header>

      {/* CATEGORY PILLS */}
      <div style={styles.categoryBar}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.categoryPill,
              backgroundColor: selectedCategory === cat ? '#121212' : '#f5f5f5',
              color: selectedCategory === cat ? '#ffffff' : '#444'
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'Vet Care' && <Stethoscope size={14} style={{ marginRight: '6px' }} />}
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loaderBox}><Loader2 className="spinner" size={40} /></div>
      ) : (
        <div className="tizly-grid">
          {products.map(product => {
            const canDelete = user && (user.role === 'admin' || product.seller_id === user.id);
            return (
              <ProductCard 
                key={product.id} 
                product={product} 
                canDelete={canDelete}
                onDelete={handleDeleteProduct}
              />
            );
          })}
          {products.length === 0 && (
            <div style={styles.empty}>
              <h3>No products found</h3>
              <p>Try refining your search keyword or selecting a different category.</p>
            </div>
          )}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>
                  {user.role === 'vet' ? 'List Vet Care Product' : 'List New Product'}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  {user.role === 'vet' 
                    ? 'List medical supplies, supplements, and clinic care items.'
                    : 'Add products to the public Tizly catalog.'}
                </p>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={styles.modalForm}>
              <div style={styles.formRow}>
                <div style={{ flex: 2 }}>
                  <label style={styles.label}>Product Name *</label>
                  <input 
                    style={styles.input}
                    required
                    placeholder="e.g. Organic Dental Gel"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Price ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    style={styles.input}
                    required
                    placeholder="29.99"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select 
                    style={styles.input}
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Vet Care">Vet Care (Medical & Health)</option>
                    <option value="Food">Food & Nutrition</option>
                    <option value="Toys">Toys & Stimulation</option>
                    <option value="Accessories">Accessories & Beds</option>
                    <option value="Supplies">Supplies & Hygiene</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input 
                    type="number"
                    style={styles.input}
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Description</label>
                <textarea 
                  style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                  placeholder="Ingredients, usage instructions, or benefit overview..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              {/* SUPABASE STORAGE IMAGE UPLOADER */}
              <ImageUploader 
                folder="products"
                label="Product Image (Supabase Storage)"
                value={newProduct.image_url}
                onChange={url => setNewProduct({ ...newProduct, image_url: url })}
              />

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  style={styles.cancelBtn} 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ minWidth: '130px' }}
                >
                  {submitting ? <Loader2 className="spinner" size={18} /> : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' },
  titleSection: { flex: '1 1 300px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#121212', margin: '0 0 6px 0' },
  subtitle: { fontSize: '15px', color: '#666', margin: 0 },
  headerActions: { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' },
  searchWrapper: { position: 'relative', minWidth: '260px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' },
  searchInput: { width: '100%', padding: '12px 14px 12px 42px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '30px', whiteSpace: 'nowrap' },
  categoryBar: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' },
  categoryPill: { border: 'none', padding: '10px 20px', borderRadius: '24px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', transition: 'all 0.2s ease' },
  loaderBox: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' },
  empty: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#888' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'flex', gap: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' },
  cancelBtn: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }
};