import { Play } from 'lucide-react';

export default function Landing() {
  return (
    <div style={styles.heroSection}>
      <div style={styles.heroContent}>
        <h1 style={styles.title}>
          Give Your Pet the Love <br /> and Care They Deserve
        </h1>
        <p style={styles.subtitle}>
          Your pet's well-being is our top priority. With trusted, <br />
          professional care, you can relax knowing they're in good hands.
        </p>
        
        <div style={styles.btnGroup}>
          <button className="btn-primary">Book Now</button>
          <button className="btn-outline">
            <div style={styles.playIcon}><Play size={14} fill="currentColor" /></div>
            Watch Video
          </button>
        </div>
      </div>

      <div style={styles.imageContainer}>
        {/* Replace with a real high-res pet image later */}
        <img 
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop" 
          alt="Cat face" 
          style={styles.heroImg}
        />
      </div>

      {/* Bottom Floating Card Info */}
      <div style={styles.bottomBar}>
        <div style={styles.packageCard}>
          <div style={styles.miniImg}>🐈</div>
          <div>
            <p style={{fontSize: '12px', opacity: 0.7}}>Package For Your Lovely Cat</p>
            <p style={{fontWeight: 'bold'}}>Pet: Cat • Grooming & Vet</p>
            <p style={{fontWeight: 'bold', fontSize: '14px'}}>$45.00</p>
          </div>
        </div>

        <div style={styles.expertCare}>
          <p style={{fontWeight: 'bold', marginBottom: '5px'}}>Our Expert Care</p>
          <div style={styles.avatars}>
            <div style={styles.avatar}>👩‍⚕️</div>
            <div style={styles.avatar}>👨‍⚕️</div>
            <div style={styles.avatar}>👩‍🔬</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heroSection: {
    display: 'flex',
    padding: '40px 8% 100px 8%',
    alignItems: 'center',
    position: 'relative'
  },
  heroContent: { flex: 1 },
  title: { fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' },
  subtitle: { fontSize: '18px', opacity: 0.8, marginBottom: '40px', lineHeight: '1.6' },
  btnGroup: { display: 'flex', gap: '20px' },
  playIcon: { background: '#eee', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' },
  imageContainer: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  heroImg: { width: '110%', borderRadius: '30px', transform: 'rotate(2deg)' },
  bottomBar: {
    position: 'absolute',
    bottom: '40px',
    left: '8%',
    right: '8%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  packageCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '24px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
  },
  miniImg: { width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  expertCare: { textAlign: 'left' },
  avatars: { display: 'flex', gap: '-10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};