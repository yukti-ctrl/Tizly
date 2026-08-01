// frontend/src/pages/Cart.jsx
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, cartTotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // If not logged in, show the "Restricted" view
  if (!user) {
    return (
      <div style={styles.empty}>
        <div style={styles.lockCircle}><Lock size={40} /></div>
        <h2>Login to View Your Cart</h2>
        <p>We save your items in your account so you can shop across devices.</p>
        <button className="btn-primary" style={{marginTop: '20px'}} onClick={() => navigate('/login')}>
          Login / Sign Up
        </button>
      </div>
    );
  }

  if (loading) return <div style={styles.empty}>Loading your cart...</div>;

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <ShoppingBag size={64} color="#ccc" />
        <h2>Hi {user.name.split(' ')[0]}, your cart is empty</h2>
        <Link to="/shop" className="btn-primary" style={{marginTop: '20px'}}>Go Shopping</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Your Cart</h1>
      <div style={styles.layout}>
        <div style={styles.itemsList}>
          {cart.map(item => (
            <div key={item.id} style={styles.itemCard}>
              <img src={item.image_url} alt={item.name} style={styles.itemImg} />
              <div style={{flex: 1}}>
                <h3 style={{margin: 0}}>{item.name}</h3>
                <p style={styles.itemPrice}>${item.price} x {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3>Order Summary</h3>
          <div style={styles.summaryRow}><span>Total</span> <span>${cartTotal.toFixed(2)}</span></div>
          <button className="btn-primary" style={{width: '100%', marginTop: '20px'}}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 8%' },
  empty: { textAlign: 'center', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
  lockCircle: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E9DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
  layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '30px' },
  itemCard: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '24px', marginBottom: '15px' },
  itemImg: { width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' },
  itemPrice: { color: '#888', fontWeight: 'bold' },
  deleteBtn: { border: 'none', background: 'none', color: '#ff5252', cursor: 'pointer' },
  summary: { backgroundColor: '#fff', padding: '30px', borderRadius: '32px', height: 'fit-content' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800' }
};