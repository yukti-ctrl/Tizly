import { Link } from 'react-router-dom';

// Simple SVG Icons to avoid library import errors
const SocialIcons = {
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  ),
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  ),
  Youtube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16H20L8.267 4H4z"></path><path d="M4 20l6.768-6.768m2.464-2.464L20 4"></path></svg>
  )
};

export default function Footer() {
  return (
    <footer style={styles.footerContainer}>
      <div style={styles.topSection}>
        <div style={styles.logo}>Tizly</div>
        
        <div style={styles.navLinks}>
          <Link to="/about">About</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/community">Community</Link>
          <Link to="/vetcare">Vetcare</Link>
          <Link to="/contact">Support</Link>
        </div>

        <div style={styles.socials}>
          <div style={styles.icon}><SocialIcons.X /></div>
          <div style={styles.icon}><SocialIcons.Facebook /></div>
          <div style={styles.icon}><SocialIcons.Instagram /></div>
          <div style={styles.icon}><SocialIcons.Youtube /></div>
        </div>
      </div>

      <hr style={styles.divider} />

      <div style={styles.bottomSection}>
        <div style={styles.legalLinks}>
          <span>© 2024 Tizly</span>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
        </div>

        <div style={styles.extraLinks}>
          <Link to="/jobs">Jobs</Link>
          <Link to="/tags">Tags</Link>
          <Link to="/resources">Resources</Link>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footerContainer: { padding: '60px 8% 40px 8%', backgroundColor: '#fff', borderTop: '1px solid #eee', marginTop: '50px' },
  topSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
  logo: { fontSize: '24px', fontWeight: '800' },
  navLinks: { display: 'flex', gap: '30px', fontWeight: '600', fontSize: '14px' },
  socials: { display: 'flex', gap: '20px' },
  icon: { cursor: 'pointer', opacity: 0.8 },
  divider: { border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '30px' },
  bottomSection: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', flexWrap: 'wrap', gap: '20px' },
  legalLinks: { display: 'flex', gap: '20px' },
  extraLinks: { display: 'flex', gap: '20px', fontWeight: '500' }
};