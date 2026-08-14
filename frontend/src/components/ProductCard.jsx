import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div style={styles.card} onClick={() => navigate(`/shop/${product.id}`)}>
      <div style={styles.imageContainer}>
        <img src={product.image_url} alt={product.name} style={styles.img} />
      </div>

      <div style={styles.info}>
        <div style={styles.metaRow}>
          <span style={styles.category}>{product.category}</span>
          <div style={styles.rating}>
            <Star size={12} fill="#FFB800" color="#FFB800" />
            <span style={{ marginLeft: '4px' }}>{product.rating || "4.8"}</span>
          </div>
        </div>

        <h3 style={styles.name}>{product.name}</h3>

        <div style={styles.priceRow}>
          <span style={styles.price}>${product.price?.toFixed(2)}</span>
          <button style={styles.cartBtn} onClick={handleAdd}>
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
    height: '100%', // Ensures all cards in a row match height
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0',
    transition: 'transform 0.2s ease'
  },
  imageContainer: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    marginBottom: '12px'
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { display: 'flex', flexDirection: 'column', flex: 1 },
  metaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  category: { fontSize: '10px', color: '#888', fontWeight: '700', textTransform: 'uppercase' },
  rating: { fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center' },
  name: { 
    fontSize: '14px', 
    fontWeight: '700', 
    color: '#121212', 
    margin: '0 0 12px 0',
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