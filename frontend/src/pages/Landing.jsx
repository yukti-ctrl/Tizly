import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, ArrowRight, Star, Heart, MessageCircle } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Landing() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [vets, setVets] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setFeaturedProducts(Array.isArray(res.data) ? res.data.slice(0, 4) : []))
       .catch(() => setFeaturedProducts([]));
    
    api.get('/vets').then(res => setVets(Array.isArray(res.data) ? res.data.slice(0, 3) : []))
       .catch(() => setVets([]));
    
    api.get('/community/posts').then(res => setPosts(Array.isArray(res.data) ? res.data.slice(0, 2) : []))
       .catch(() => setPosts([]));
  }, []);

  return (
    <div style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>🐾 Trusted by 10k+ Pet Parents</div>
          <h1 style={styles.title}>Give Your Pet the Love <br /> and Care They Deserve</h1>
          <p style={styles.subtitle}>Professional care and premium supplies for your best friends.</p>
          <div style={styles.btnGroup}>
            <button className="btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
          </div>
        </div>
        <div style={styles.heroImageContainer}>
          <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop" style={styles.heroImg} alt="Cat" />
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Expert Care</h2>
        <div style={styles.vetGrid}>
          {Array.isArray(vets) && vets.length > 0 ? vets.map(vet => (
            <div key={vet.id} style={styles.vetCard}>
              <img src={vet.image_url} alt={vet.name} style={styles.vetImg} />
              <h4>{vet.name}</h4>
              <p>{vet.specialization}</p>
            </div>
          )) : <p>Loading expert vets...</p>}
        </div>
      </section>

      <section style={{...styles.section, backgroundColor: '#fff', borderRadius: '40px'}}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productGrid}>
          {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : <p>Visit our shop to see all products.</p>}
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column' },
  section: { padding: '60px 8%' },
  sectionTitle: { fontSize: '32px', fontWeight: '800', marginBottom: '30px' },
  heroSection: { display: 'flex', padding: '60px 8%', alignItems: 'center', gap: '40px' },
  heroContent: { flex: 1.2 },
  title: { fontSize: '56px', fontWeight: '800', lineHeight: '1.1' },
  subtitle: { fontSize: '18px', opacity: 0.7, margin: '20px 0 40px 0' },
  badge: { backgroundColor: '#E9DCC9', padding: '8px 16px', borderRadius: '50px', display: 'inline-block', marginBottom: '20px' },
  btnGroup: { display: 'flex', gap: '20px' },
  heroImageContainer: { flex: 1 },
  heroImg: { width: '100%', borderRadius: '40px' },
  vetGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  vetCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  vetImg: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px', objectFit: 'cover' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }
};