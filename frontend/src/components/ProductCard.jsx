import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Access the addToCart function

  return (
    <div 
      style={styles.card} 
      onClick={() => navigate(`/shop/${product.id}`)}
    >
      <div style={styles.imageContainer}>
        <img src={product.image_url} alt={product.name} style={styles.img} />
      </div>
      <div style={styles.info}>
        <div style={styles.categoryRow}>
          <span style={styles.category}>{product.category}</span>
          <div style={styles.rating}>
            <Star size={12} fill="#FFB800" color="#FFB800" />
            <span style={{marginLeft: '4px'}}>{product.rating}</span>
          </div>
        </div>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.priceRow}>
          <span style={styles.price}>${product.price.toFixed(2)}</span>
          {/* Updated this button to actually add the item to the cart */}
          <button 
            style={styles.cartBtn} 
            onClick={(e) => {
              e.stopPropagation(); // Prevents clicking the button from opening the detail page
              addToCart(product);  // Calls the cart context function
            }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  },
  imageContainer: {
    width: '100%',
    height: '180px',
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginBottom: '15px'
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { padding: '0 5px' },
  categoryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  category: { fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  rating: { fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' },
  name: { fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#121212' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '20px', fontWeight: '800', color: '#000' },
  cartBtn: {
    backgroundColor: '#121212',
    color: '#fff',
    border: 'none',
    width: '35px',
    height: '35px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};