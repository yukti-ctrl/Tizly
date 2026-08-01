// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={styles.navContainer}>
      <div style={styles.navbar}>
        <Link to="/" style={styles.logo}>Tizly</Link>
        
        <div style={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/community">Community</Link>
          <Link to="/vetcare">Vetcare</Link>
        </div>

        <div style={styles.right}>
          <Link to="/cart" style={styles.cartWrapper}>
            <ShoppingCart size={22} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
          
          {user ? (
            <div style={styles.profileSection}>
              {/* Profile Icon / Avatar */}
              <div style={styles.avatar} onClick={() => navigate('/profile')}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" style={styles.avatarImg} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <button onClick={logout} style={styles.logoutBtn} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
              <button onClick={() => navigate('/signup')} style={styles.getStarted}>Get Started</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navContainer: { display: 'flex', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'sticky', top: 0, zIndex: 1000 },
  navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', width: '90%', maxWidth: '1200px', padding: '10px 25px', borderRadius: '100px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' },
  logo: { fontSize: '24px', fontWeight: '800', color: '#121212', letterSpacing: '-1px' },
  links: { display: 'flex', gap: '25px', fontWeight: '600', fontSize: '15px' },
  right: { display: 'flex', alignItems: 'center', gap: '20px' },
  cartWrapper: { position: 'relative', display: 'flex', alignItems: 'center', color: '#121212' },
  badge: { position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#ff8a65', color: '#fff', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' },
  
  profileSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E9DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  
  loginBtn: { background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' },
  getStarted: { backgroundColor: '#121212', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer' },
  logoutBtn: { background: '#f5f5f5', border: 'none', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff5252' }
};