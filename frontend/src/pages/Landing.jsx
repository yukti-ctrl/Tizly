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
    // Fetch data for all sections with safety checks
    api.get('/products').then(res => 
      setFeaturedProducts(Array.isArray(res.data) ? res.data.slice(0, 4) : [])
    ).catch(() => setFeaturedProducts([]));

    api.get('/vets').then(res => 
      setVets(Array.isArray(res.data) ? res.data.slice(0, 3) : [])
    ).catch(() => setVets([]));

    api.get('/community/posts').then(res => 
      setPosts(Array.isArray(res.data) ? res.data.slice(0, 2) : [])
    ).catch(() => setPosts([]));
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
          {/* Main Image */}
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop" 
            alt="Tizly Hero Cat" 
            style={styles.heroImg}
          />
          
          {/* TAG ROW: Positioned below the image */}
          <div style={styles.tagRow}>
            <div style={styles.floatingTagCard}>
              <div style={styles.miniImg}>🐈</div>
              <div>
                <p style={styles.tagSub}>Top Rated</p>
                <p style={styles.tagMain}>Grooming + Vet</p>
                <p style={styles.tagPrice}>$45.00</p>
              </div>
            </div>

            <div style={styles.floatingTagCard}>
              <div style={styles.miniImg}>✨</div>
              <div>
                <p style={styles.tagSub}>Professional</p>
                <p style={styles.tagMain}>24/7 Support</p>
                <p style={styles.tagPrice}>Trusted Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2. EXPERT CARE SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.headerText}>
            <h2 style={styles.sectionTitle}>Our Expert Care</h2>
            <p style={styles.sectionSub}>Meet our certified professional veterinarians</p>
          </div>
          <Link to="/vetcare" style={styles.viewAll}>View All Vets <ArrowRight size={18} /></Link>
        </div>

        <div style={styles.responsiveGrid}>
          {vets.map(vet => (
            <div key={vet.id} style={styles.vetCard}>
              <img src={vet.image_url} alt={vet.name} style={styles.vetImg} />
              <h4 style={{marginTop: '15px', fontSize: '18px', fontWeight: '800'}}>{vet.name}</h4>
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
      <section style={{...styles.section, backgroundColor: '#fff', borderRadius: '40px'}}>
        <div style={styles.sectionHeader}>
          <div style={styles.headerText}>
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
          <div style={styles.headerText}>
            <h2 style={styles.sectionTitle}>Community Moments</h2>
            <p style={styles.sectionSub}>Latest stories from pet lovers like you</p>
          </div>
          <Link to="/community" style={styles.viewAll}>Join Community <ArrowRight size={18} /></Link>
        </div>

        <div style={styles.communityGrid}>
          {posts.map(post => (
            <div key={post.id} style={styles.glimpseCard}>
              <div style={styles.glimpseHeader}>
                <div style={styles.glimpseAvatar}>{post.author ? post.author[0] : 'U'}</div>
                <span style={{fontWeight: 'bold'}}>{post.author || "User"}</span>
              </div>
              <p style={styles.glimpseText}>{post.content ? post.content.substring(0, 100) : ""}...</p>
              <div style={styles.glimpseStats}>
                <span style={styles.stat}><Heart size={16} /> {post.likes || 0}</span>
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
  page: { display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' },
  badge: { backgroundColor: '#E9DCC9', color: '#121212', width: 'fit-content', padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: '800', marginBottom: '20px' },
  
  // HERO: Responsive Flex Setup
  heroSection: { 
    display: 'flex', 
    flexWrap: 'wrap', // Stacks on mobile
    padding: '60px 5%', 
    alignItems: 'center', 
    minHeight: '80vh', 
    gap: '40px',
    justifyContent: 'center'
  },
  heroContent: { 
    flex: '1 1 450px',
    textAlign: 'left',
    minWidth: 0,
    width: '100%'
  },
  title: { 
    fontSize: 'clamp(28px, 6vw, 64px)', // Responsive font size
    fontWeight: '900', 
    lineHeight: '1.1', 
    marginBottom: '20px', 
    letterSpacing: '-1.5px' 
  },
  subtitle: { 
    fontSize: 'clamp(15px, 2vw, 18px)', 
    opacity: 0.7, 
    marginBottom: '30px', 
    lineHeight: '1.6', 
    maxWidth: '550px' 
  },
  btnGroup: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  playIcon: { background: '#eee', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' },
  
  // HERO IMAGE & TAGS
  heroImageContainer: { 
    flex: '1 1 400px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '20px',
    minWidth: 0,
    width: '100%'
  },
  heroImg: { 
    width: '100%', 
    maxWidth: '550px', 
    borderRadius: '40px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)' 
  },
  tagRow: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap' // Tags wrap on tiny screens
  },
  floatingTagCard: { 
    backgroundColor: '#fff', 
    padding: '12px 18px', 
    borderRadius: '24px', 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    flex: '1 1 200px',
    maxWidth: '260px',
    border: '1px solid rgba(0,0,0,0.03)'
  },
  miniImg: { 
    fontSize: '20px', 
    background: '#F8F4F0', 
    width: '40px', 
    height: '40px', 
    borderRadius: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tagSub: { fontSize: '10px', opacity: 0.5, margin: 0, fontWeight: '700', textTransform: 'uppercase' },
  tagMain: { fontWeight: '800', fontSize: '13px', margin: 0, color: '#121212' },
  tagPrice: { fontWeight: '700', fontSize: '12px', margin: 0, color: '#ff8a65' },

  // SECTIONS & GRIDS
  section: { padding: '80px 5%' },
  sectionHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  headerText: { flex: 1, minWidth: '250px' },
  sectionTitle: { fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '800' },
  sectionSub: { color: '#666', marginTop: '5px' },
  viewAll: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#121212', fontSize: '14px', whiteSpace: 'nowrap' },
  
  responsiveGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '25px' 
  },
  vetCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  vetImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #F8F4F0' },
  rating: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  productGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // Auto-responsive columns
    gap: '20px' 
  },
  
  communityGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '25px' 
  },
  glimpseCard: { backgroundColor: '#F8F4F0', padding: '30px', borderRadius: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  glimpseHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  glimpseAvatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#E9DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' },
  glimpseText: { color: '#555', lineHeight: '1.6', marginBottom: '20px' },
  glimpseStats: { display: 'flex', gap: '20px', color: '#888' },
  stat: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600' }
};