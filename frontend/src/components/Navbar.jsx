import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav style={styles.navContainer}>
        <div style={styles.navbar}>
          
          <div style={styles.leftSection}>
            {/* 3-Line Expandable Button (Hamburger) */}
            <button onClick={toggleMenu} style={styles.menuToggle}>
              <Menu size={24} />
            </button>
            <Link to="/" style={styles.logo}>Tizly</Link>
          </div>
          
          <div style={styles.desktopLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/shop" style={styles.navLink}>Shop</Link>
            <Link to="/community" style={styles.navLink}>Community</Link>
            <Link to="/vetcare" style={styles.navLink}>Vetcare</Link>
          </div>

          <div style={styles.rightSection}>
            <Link to="/cart" style={styles.cartWrapper}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
            
            {user ? (
              <div style={styles.profileCircle} onClick={() => navigate('/profile')}>
                {user.photoURL ? <img src={user.photoURL} alt="p" style={styles.avatar} /> : <User size={18} />}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {/* ANIMATED MOBILE DRAWER */}
      <div 
        style={{
          ...styles.drawerOverlay, 
          display: isMenuOpen ? 'flex' : 'none'
        }} 
        className="overlay-fade"
        onClick={toggleMenu}
      >
        <div 
          style={styles.drawer} 
          className={isMenuOpen ? "drawer-open" : "drawer-closed"}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.drawerHeader}>
            <span style={styles.logo}>Tizly</span>
            <button onClick={toggleMenu} style={styles.closeBtn}><X size={26} /></button>
          </div>
          <div style={styles.drawerLinks}>
            <Link to="/" style={styles.mobileNavLink} onClick={toggleMenu}>Home</Link>
            <Link to="/shop" style={styles.mobileNavLink} onClick={toggleMenu}>Shop</Link>
            <Link to="/community" style={styles.mobileNavLink} onClick={toggleMenu}>Community</Link>
            <Link to="/vetcare" style={styles.mobileNavLink} onClick={toggleMenu}>Vetcare</Link>
            <hr style={styles.divider} />
            {user ? (
               <button onClick={() => { logout(); toggleMenu(); }} style={styles.logoutBtn}>
                <LogOut size={18} /> Logout
               </button>
            ) : (
               <button onClick={() => { navigate('/login'); toggleMenu(); }} style={styles.loginBtnMobile}>Login</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  navContainer: { display: 'flex', justifyContent: 'center', padding: '15px 0', width: '100%', position: 'sticky', top: 0, zIndex: 1000 },
  navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', width: '92%', maxWidth: '1200px', padding: '10px 20px', borderRadius: '100px', boxShadow: '0 4px 25px rgba(0,0,0,0.06)' },
  leftSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { fontSize: '22px', fontWeight: '900', color: '#121212', letterSpacing: '-1px', textDecoration: 'none' },
  menuToggle: { background: 'none', border: 'none', cursor: 'pointer', display: window.innerWidth > 1024 ? 'none' : 'flex' },
  desktopLinks: { display: window.innerWidth > 1024 ? 'flex' : 'none', gap: '25px' },
  navLink: { textDecoration: 'none', color: '#121212', fontWeight: '700', fontSize: '14px', opacity: 0.8 },
  rightSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  cartWrapper: { position: 'relative', display: 'flex', color: '#121212' },
  badge: { position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#ff8a65', color: '#fff', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' },
  profileCircle: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#F8F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', border: '1px solid #eee' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  loginBtn: { backgroundColor: '#121212', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '50px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
  
  drawerOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 },
  drawer: { width: '280px', backgroundColor: '#fff', height: '100%', padding: '40px 30px', boxShadow: '10px 0 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '40px', position: 'absolute', left: 0 },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  drawerLinks: { display: 'flex', flexDirection: 'column', gap: '25px' },
  mobileNavLink: { fontSize: '20px', fontWeight: '800', color: '#121212', textDecoration: 'none' },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '5px 0' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', color: '#ff5252', background: 'none', border: 'none', fontWeight: '700', fontSize: '18px', cursor: 'pointer' },
  loginBtnMobile: { backgroundColor: '#121212', color: '#fff', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '700', fontSize: '16px' }
};