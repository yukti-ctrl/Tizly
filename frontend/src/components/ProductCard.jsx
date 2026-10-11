import React from 'react';
import { ShoppingCart, Star, Trash2, Stethoscope, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, canDelete, onDelete }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(product.id);
  };

  const isVetProduct = product.category?.toLowerCase().includes('vet') || product.seller_role === 'vet';

  return (
    <div style={styles.card} onClick={() => navigate(`/shop/${product.id}`)}>
      <div style={styles.imageContainer}>
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80"} 
          alt={product.name} 
          style={styles.img} 
        />
        {isVetProduct && (
          <div style={styles.vetBadge}>
            <Stethoscope size={11} /> Vet Approved
          </div>
        )}
        {canDelete && (
          <button style={styles.deleteBtn} onClick={handleDelete} title="Delete Product">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.metaRow}>
          <span style={{
            ...styles.category,
            color: isVetProduct ? '#00796b' : '#888'
          }}>
            {product.category}
          </span>
          <div style={styles.rating}>
            <Star size={12} fill="#FFB800" color="#FFB800" />
            <span style={{ marginLeft: '4px' }}>{product.rating || "4.8"}</span>
          </div>
        </div>

        <h3 style={styles.name}>{product.name}</h3>

        <div style={styles.priceRow}>
          <div>
            <span style={styles.price}>${product.price?.toFixed(2)}</span>
            {product.seller_name && (
              <p style={styles.sellerName}>by {product.seller_name}</p>
            )}
          </div>
          <button style={styles.cartBtn} onClick={handleAdd} title="Add to Cart">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative'
  },
  imageContainer: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    marginBottom: '12px',
    position: 'relative'
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  vetBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#E0F2F1',
    color: '#00695C',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  deleteBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#d32f2f',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  info: { display: 'flex', flexDirection: 'column', flex: 1 },
  metaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' },
  category: { fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' },
  rating: { fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center' },
  name: { 
    fontSize: '14px', 
    fontWeight: '700', 
    color: '#121212', 
    margin: '0 0 8px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.4'
  },
  priceRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 'auto' 
  },
  price: { fontSize: '16px', fontWeight: '800', color: '#121212' },
  sellerName: { fontSize: '11px', color: '#888', margin: '2px 0 0 0' },
  cartBtn: { 
    backgroundColor: '#121212', 
    color: '#fff', 
    border: 'none', 
    width: '34px', 
    height: '34px', 
    borderRadius: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'pointer' 
  }
};