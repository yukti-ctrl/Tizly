import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div style={{padding: '100px', textAlign: 'center'}}>Loading details...</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div style={styles.content}>
        {/* Left: Image */}
        <div style={styles.imageSection}>
          <img src={product.image_url} alt={product.name} style={styles.mainImg} />
        </div>

        {/* Right: Info */}
        <div style={styles.infoSection}>
          <span style={styles.tag}>{product.category}</span>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          
          <p style={styles.description}>
            {product.description || "No description provided for this premium pet product."}
          </p>

          <div style={styles.actionRow}>
            <div style={styles.qtySelector}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}><Minus size={16} /></button>
              <span style={styles.qtyVal}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={styles.qtyBtn}><Plus size={16} /></button>
            </div>
            
            <button className="btn-primary" style={{flex: 1, justifyContent: 'center'}}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            
            <button style={styles.wishBtn}><Heart size={20} /></button>
          </div>

          <div style={styles.meta}>
            <p><strong>Stock:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            <p><strong>Free Shipping</strong> on orders over $50</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 8%' },
  backBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '30px' },
  content: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' },
  imageSection: { backgroundColor: '#fff', borderRadius: '32px', padding: '20px', overflow: 'hidden' },
  mainImg: { width: '100%', borderRadius: '20px', objectFit: 'contain' },
  infoSection: { padding: '20px 0' },
  tag: { backgroundColor: '#E9DCC9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', display: 'inline-block' },
  title: { fontSize: '48px', fontWeight: '800', marginBottom: '10px' },
  price: { fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '25px' },
  description: { fontSize: '16px', lineHeight: '1.6', color: '#666', marginBottom: '40px' },
  actionRow: { display: 'flex', gap: '15px', marginBottom: '40px' },
  qtySelector: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '12px', padding: '5px', border: '1px solid #eee' },
  qtyBtn: { background: 'none', border: 'none', padding: '10px', cursor: 'pointer' },
  qtyVal: { padding: '0 15px', fontWeight: '700', fontSize: '18px' },
  wishBtn: { background: '#fff', border: '1px solid #eee', padding: '12px', borderRadius: '12px', cursor: 'pointer' },
  meta: { borderTop: '1px solid #eee', paddingTop: '20px', color: '#888', fontSize: '14px', display: 'grid', gap: '10px' }
};