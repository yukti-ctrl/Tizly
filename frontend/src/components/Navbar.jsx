import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav style={styles.navContainer}>
      <div style={styles.navbar}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>Tizly</Link>
        
        {/* Navigation Links */}
        <div style={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/community">Community</Link>
          <Link to="/vetcare">Vetcare</Link>
        </div>

        {/* Right Side Icons */}
        <div style={styles.right}>
          {/* Single Cart Icon with Badge */}
          <Link to="/cart" style={styles.cartWrapper}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </Link>
          
          <Link to="/profile" style={styles.iconLink}>
            <User size={22} />
          </Link>

          <button style={styles.getStarted}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 0',
    width: '100%',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    width: '90%',
    maxWidth: '1200px',
    padding: '10px 30px',
    borderRadius: '100px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    zIndex: 100,
  },
  logo: { 
    fontSize: '24px', 
    fontWeight: '800', 
    color: '#121212', 
    letterSpacing: '-1px' 
  },
  links: { 
    display: 'flex', 
    gap: '30px', 
    fontWeight: '600', 
    fontSize: '15px' 
  },
  right: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px' 
  },
  cartWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: '#121212',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    backgroundColor: '#ff8a65', // Soft orange to match pet theme
    color: '#fff',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white'
  },
  iconLink: {
    color: '#121212',
    display: 'flex',
    alignItems: 'center'
  },
  getStarted: {
    backgroundColor: '#121212',
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  }
};