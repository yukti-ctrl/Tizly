import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <ShoppingBag size={64} color="#ccc" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any treats yet!</p>
        <Link to="/shop" className="btn-primary" style={{marginTop: '20px'}}>Go Shopping</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={{marginBottom: '40px', fontWeight: '800'}}>Your Cart</h1>
      
      <div style={styles.layout}>
        <div style={styles.itemsList}>
          {cart.map(item => (
            <div key={item.id} style={styles.itemCard}>
              <img src={item.image_url} alt={item.name} style={styles.itemImg} />
              <div style={{flex: 1}}>
                <h3 style={{margin: '0 0 5px 0'}}>{item.name}</h3>
                <p style={{color: '#888', fontSize: '14px'}}>{item.category}</p>
              </div>
              <div style={styles.qtyControl}>
                <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}><Minus size={14} /></button>
                <span style={{fontWeight: 'bold'}}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}><Plus size={14} /></button>
              </div>
              <p style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} style={styles.deleteBtn}><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3 style={{marginBottom: '20px'}}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{color: '#4db6ac'}}>FREE</span>
          </div>
          <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #eee'}} />
          <div style={{...styles.summaryRow, fontWeight: '800', fontSize: '18px'}}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="btn-primary" style={{width: '100%', marginTop: '30px', justifyContent: 'center'}}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 8%' },
  empty: { textAlign: 'center', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '50px' },
  itemCard: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
  itemImg: { width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f9f9f9', padding: '5px 12px', borderRadius: '10px' },
  qtyBtn: { border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  itemPrice: { fontWeight: '800', fontSize: '18px', width: '100px', textAlign: 'right' },
  deleteBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#ff5252', padding: '10px' },
  summary: { backgroundColor: '#fff', padding: '30px', borderRadius: '24px', height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }
};