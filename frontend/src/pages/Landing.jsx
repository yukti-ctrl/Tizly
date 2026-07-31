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
    // Fetch data for all sections
    api.get('/products').then(res => setFeaturedProducts(res.data.slice(0, 4)));
    api.get('/vets').then(res => setVets(res.data.slice(0, 3)));
    api.get('/community/posts').then(res => setPosts(res.data.slice(0, 2)));
  }, []);

  return (
    <div style={styles.page}>
      
      
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>🐾 Trusted by 10k+ Pet Parents</div>
          <h1 style={styles.title}>
            Give Your Pet the Love <br /> and Care They Deserve
          </h1>
          <p style={styles.subtitle}>
            Your pet's well-being is our top priority. From premium organic food 
            to expert veterinary consultations, we provide everything your friend needs.
          </p>
          
          <div style={styles.btnGroup}>
            <button className="btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
            <button className="btn-outline">
              <div style={styles.playIcon}><Play size={14} fill="currentColor" /></div>
              Watch Video
            </button>
          </div>
        </div>

        <div style={styles.heroImageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop" 
            alt="Straightened Cat" 
            style={styles.heroImg}
          />
          
          {/* REPOSITIONED FLOATING TAG */}
          <div style={styles.floatingTag}>
            <div style={styles.miniImg}>🐈</div>
            <div>
              <p style={{fontSize: '11px', opacity: 0.6, margin: 0}}>Top Rated Package</p>
              <p style={{fontWeight: '800', fontSize: '14px', margin: 0, color: '#121212'}}>Grooming + Vet</p>
              <p style={{fontWeight: '700', fontSize: '13px', margin: 0, color: '#ff8a65'}}>$45.00</p>
            </div>
          </div>

          {/* ADDED SECOND TAG FOR BALANCE */}
          <div style={styles.floatingTagRight}>
            <div style={styles.miniImg}>✨</div>
            <div>
              <p style={{fontSize: '11px', opacity: 0.6, margin: 0}}>Professional</p>
              <p style={{fontWeight: '800', fontSize: '14px', margin: 0}}>24/7 Support</p>
            </div>
          </div>
        </div>
      </section>


      {/* 2. EXPERT CARE SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Our Expert Care</h2>
            <p style={styles.sectionSub}>Meet our certified professional veterinarians</p>
          </div>
          <Link to="/vetcare" style={styles.viewAll}>View All Vets <ArrowRight size={18} /></Link>
        </div>

        <div style={styles.vetGrid}>
          {vets.map(vet => (
            <div key={vet.id} style={styles.vetCard}>
              <img src={vet.image_url} alt={vet.name} style={styles.vetImg} />
              <h4 style={{marginTop: '15px', fontSize: '18px'}}>{vet.name}</h4>
              <p style={{color: '#888', fontSize: '14px', marginBottom: '10px'}}>{vet.specialization}</p>
              <div style={styles.rating}>
                <Star size={14} fill="#FFB800" color="#FFB800" />
                <span style={{marginLeft: '5px', fontWeight: 'bold'}}>4.9</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section style={{...styles.section, backgroundColor: '#fff', borderRadius: '40px', padding: '60px 40px'}}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
            <p style={styles.sectionSub}>Best sellers chosen by our community</p>
          </div>
          <Link to="/shop" style={styles.viewAll}>Visit Shop <ArrowRight size={18} /></Link>
        </div>

        <div style={styles.productGrid}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. COMMUNITY GLIMPSE SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Community Moments</h2>
            <p style={styles.sectionSub}>Latest stories from pet lovers like you</p>
          </div>
          <Link to="/community" style={styles.viewAll}>Join Community <ArrowRight size={18} /></Link>
        </div>

        <div style={styles.communityGrid}>
          {posts.map(post => (
            <div key={post.id} style={styles.glimpseCard}>
              <div style={styles.glimpseHeader}>
                <div style={styles.glimpseAvatar}>{post.author[0]}</div>
                <span style={{fontWeight: 'bold'}}>{post.author}</span>
              </div>
              <p style={styles.glimpseText}>{post.content.substring(0, 100)}...</p>
              <div style={styles.glimpseStats}>
                <span style={styles.stat}><Heart size={16} /> {post.likes}</span>
                <span style={styles.stat}><MessageCircle size={16} /> 12</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: '20px' },
  badge: { backgroundColor: '#E9DCC9', width: 'fit-content', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' },
  heroSection: { display: 'flex', padding: '60px 8%', alignItems: 'center', minHeight: '80vh', gap: '40px' },
  heroContent: { flex: 1.2 },
  title: { fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' },
  subtitle: { fontSize: '18px', opacity: 0.7, marginBottom: '40px', lineHeight: '1.6', maxWidth: '500px' },
  btnGroup: { display: 'flex', gap: '20px' },
  playIcon: { background: '#eee', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' },
   heroImageContainer: { 
    flex: 1, 
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  heroImg: { 
    width: '100%', 
    maxWidth: '1000px', // Prevents it from becoming too massive
    borderRadius: '40px', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    zIndex: 1
  },
  floatingTag: { 
    position: 'absolute', 
    bottom: '40px', 
    left: '-10px', // Pushes it further left so it just "clips" the edge of the image
    backgroundColor: '#fff', 
    padding: '15px 20px', 
    borderRadius: '24px', 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 2,
    border: '1px solid rgba(0,0,0,0.05)'
  },
  floatingTagRight: { 
    position: 'absolute', 
    top: '40px', 
    right: '-10px', 
    backgroundColor: '#fff', 
    padding: '12px 18px', 
    borderRadius: '24px', 
    display: 'flex', 
    gap: '10px', 
    alignItems: 'center', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    zIndex: 2,
    border: '1px solid rgba(0,0,0,0.05)'
  },
  miniImg: { 
    fontSize: '20px', 
    background: '#F8F4F0', 
    width: '45px', 
    height: '45px', 
    borderRadius: '12px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  section: { padding: '80px 8%' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
  sectionTitle: { fontSize: '32px', fontWeight: '800' },
  sectionSub: { color: '#666', marginTop: '5px' },
  viewAll: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#121212', fontSize: '14px' },
  
  vetGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' },
  vetCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '30px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  vetImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #F8F4F0' },
  rating: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  
  communityGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' },
  glimpseCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  glimpseHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  glimpseAvatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#E9DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' },
  glimpseText: { color: '#555', lineHeight: '1.6', marginBottom: '20px' },
  glimpseStats: { display: 'flex', gap: '20px', color: '#888' },
  stat: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600' }
};