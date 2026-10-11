import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Trash2, Stethoscope, ShieldCheck } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      navigate('/shop');
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product.");
      setDeleting(false);
    }
  };

  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading details...</div>;

  const canManage = user && (user.role === 'admin' || product.seller_id === user.id);
  const isVetProduct = product.category?.toLowerCase().includes('vet') || product.seller_role === 'vet';

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <button onClick={() => navigate('/shop')} style={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Shop
        </button>
        {canManage && (
          <button onClick={handleDelete} disabled={deleting} style={styles.deleteBtn}>
            <Trash2 size={16} /> Delete Product
          </button>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.imageSection}>
          <img 
            src={product.image_url || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80"} 
            alt={product.name} 
            style={styles.mainImg} 
          />
        </div>

        <div style={styles.infoSection}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{
              ...styles.tag,
              backgroundColor: isVetProduct ? '#E0F2F1' : '#E9DCC9',
              color: isVetProduct ? '#00695C' : '#333'
            }}>
              {product.category}
            </span>
            {isVetProduct && (
              <span style={styles.vetBadge}><Stethoscope size={13} /> Vet Approved</span>
            )}
          </div>

          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          
          <p style={styles.description}>{product.description}</p>

          <div style={styles.actionRow}>
            <div style={styles.qtySelector}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}><Minus size={16} /></button>
              <span style={styles.qtyVal}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={styles.qtyBtn}><Plus size={16} /></button>
            </div>
            
            <button 
              className="btn-primary" 
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            
            <button style={styles.wishBtn}><Heart size={20} /></button>
          </div>

          <div style={styles.meta}>
            <div><strong>Availability:</strong> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
            {product.seller_name && (
              <div><strong>Merchant / Practitioner:</strong> {product.seller_name} ({product.seller_role || 'Verified Partner'})</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 8%', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh' },
  navBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  backBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  content: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'start' },
  imageSection: { backgroundColor: '#fff', borderRadius: '32px', padding: '20px', overflow: 'hidden', border: '1px solid #eee' },
  mainImg: { width: '100%', maxHeight: '480px', borderRadius: '20px', objectFit: 'contain' },
  infoSection: { padding: '10px 0' },
  tag: { padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block' },
  vetBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#00695C', color: '#fff', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' },
  title: { fontSize: '38px', fontWeight: '800', margin: '0 0 10px 0', color: '#121212' },
  price: { fontSize: '28px', fontWeight: '800', color: '#121212', margin: '0 0 20px 0' },
  description: { fontSize: '15px', lineHeight: '1.6', color: '#666', marginBottom: '30px' },
  actionRow: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' },
  qtySelector: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '14px', padding: '4px', border: '1px solid #eee' },
  qtyBtn: { background: 'none', border: 'none', padding: '10px 14px', cursor: 'pointer' },
  qtyVal: { padding: '0 12px', fontWeight: '700', fontSize: '16px' },
  wishBtn: { background: '#fff', border: '1px solid #eee', padding: '14px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  meta: { borderTop: '1px solid #eee', paddingTop: '20px', color: '#888', fontSize: '14px', display: 'grid', gap: '10px' }
};