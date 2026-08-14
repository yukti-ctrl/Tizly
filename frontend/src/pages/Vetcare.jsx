import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Stethoscope, Star, CheckCircle, ShieldCheck, Award, Loader2 } from 'lucide-react';

export default function Vetcare() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vets').then(res => setVets(Array.isArray(res.data) ? res.data : []))
       .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Professional Vetcare</h1>
        <p style={styles.subtitle}>Connecting you with the best specialists for your pet's health.</p>
      </header>

      {loading ? (
        <div style={styles.center}><Loader2 className="spinner" size={40}/></div>
      ) : (
        <div className="vet-grid">
          {vets.map(vet => (
            <div key={vet.id} style={styles.vetCard}>
              <div style={styles.imageBox}>
                <img src={vet.image_url} alt={vet.name} style={styles.vetImg} />
                <div style={styles.ratingBadge}><Star size={12} fill="#FFB800" /> 4.9</div>
              </div>
              
              <div style={styles.vetInfo}>
                <div style={styles.tag}><Award size={14} /> Certified Specialist</div>
                <h3 style={styles.vetName}>{vet.name}</h3>
                <p style={styles.spec}>{vet.specialization}</p>
                <p style={styles.bio}>{vet.bio}</p>
                
                <div style={styles.features}>
                  <div style={styles.feat}><CheckCircle size={14} color="#4db6ac"/> Home Visit</div>
                  <div style={styles.feat}><CheckCircle size={14} color="#4db6ac"/> Video Call</div>
                </div>

                <button className="btn-primary" style={styles.bookBtn}>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMERGENCY BANNER */}
      <div style={styles.emergencyBox}>
        <div style={styles.emergencyIcon}><ShieldCheck size={30} /></div>
        <div>
          <h4 style={{margin:0}}>Emergency 24/7 Support</h4>
          <p style={{margin:0, opacity: 0.8, fontSize: '14px'}}>Our triage team is always online for urgent cases.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 5% 80px 5%' },
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: 'clamp(30px, 6vw, 48px)', fontWeight: '900', margin: 0, letterSpacing: '-2px' },
  subtitle: { color: '#666', fontSize: '18px', maxWidth: '600px', margin: '10px auto' },
  
  vetCard: { backgroundColor: '#fff', borderRadius: '32px', padding: '20px', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' },
  imageBox: { width: '100%', height: '240px', borderRadius: '24px', overflow: 'hidden', position: 'relative', marginBottom: '20px' },
  vetImg: { width: '100%', height: '100%', objectFit: 'cover' },
  ratingBadge: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#fff', padding: '5px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  
  vetInfo: { padding: '0 5px' },
  tag: { color: '#ff8a65', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' },
  vetName: { fontSize: '22px', fontWeight: '800', margin: '0 0 5px 0' },
  spec: { fontSize: '14px', color: '#888', fontWeight: '600', marginBottom: '15px' },
  bio: { fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '20px', height: '65px', overflow: 'hidden' },
  
  features: { display: 'flex', gap: '15px', marginBottom: '25px' },
  feat: { fontSize: '12px', fontWeight: '700', color: '#444', display: 'flex', alignItems: 'center', gap: '5px' },
  bookBtn: { width: '100%', justifyContent: 'center', padding: '15px', borderRadius: '15px' },
  
  emergencyBox: { marginTop: '80px', backgroundColor: '#121212', color: '#fff', padding: '30px', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
  emergencyIcon: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  center: { display: 'flex', justifyContent: 'center', padding: '100px 0' }
};