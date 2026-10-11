import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, cartTotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert("Checkout initiated! Order will be processed.");
  };

  if (loading) return <div style={styles.empty}>Loading your cart...</div>;

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <ShoppingBag size={64} color="#ccc" />
        <h2>Your cart is empty</h2>
        <p style={{ color: '#777', maxWidth: '360px', margin: '8px auto 20px auto' }}>
          Discover organic food, toys, and vet-approved products in our shop.
        </p>
        <Link to="/shop" className="btn-primary">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800' }}>Your Cart</h1>
        <p style={{ color: '#666', margin: '6px 0 0 0' }}>
          {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items in your cart
        </p>
      </header>

      {/* Guest Notice */}
      {!user && (
        <div style={styles.guestNote}>
          <ShieldCheck size={18} color="#00796b" />
          <span>You are shopping as a guest. Your items are saved on this device. Log in at checkout to sync across devices.</span>
        </div>
      )}

      <div style={styles.layout}>
        <div style={styles.itemsList}>
          {cart.map(item => (
            <div key={item.id} style={styles.itemCard}>
              <img 
                src={item.image_url || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80"} 
                alt={item.name} 
                style={styles.itemImg} 
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700' }}>{item.name}</h3>
                <p style={styles.itemPrice}>${item.price?.toFixed(2)} × {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={styles.deleteBtn} title="Remove item">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal</span> 
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Estimated Shipping</span> 
            <span style={{ color: '#2e7d32', fontWeight: '600' }}>Free</span>
          </div>
          <div style={{ ...styles.summaryRow, borderTop: '1px solid #eee', paddingTop: '14px', marginTop: '10px', fontWeight: '800', fontSize: '18px' }}>
            <span>Total</span> 
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={handleCheckout}
          >
            {user ? (
              <><span>Proceed to Checkout</span> <ArrowRight size={18} /></>
            ) : (
              <><LogIn size={18} /> <span>Log in to Checkout</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  guestNote: {
    backgroundColor: '#E0F2F1',
    color: '#00695C',
    padding: '12px 18px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    marginBottom: '24px'
  },
  layout: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  itemsList: { flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '20px',
    border: '1px solid #eee',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  },
  itemImg: { width: '80px', height: '80px', borderRadius: '14px', objectFit: 'cover' },
  itemPrice: { margin: 0, color: '#666', fontSize: '14px' },
  deleteBtn: { background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', padding: '8px' },
  summary: {
    flex: '1 1 320px',
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid #eee',
    height: 'fit-content',
    boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#444' }
};