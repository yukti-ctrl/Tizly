import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, Clock, Award, CheckCircle } from 'lucide-react';

export default function Vetcare() {
  const [vets, setVets] = useState([]);

  useEffect(() => {
    api.get('/vets').then(res => setVets(res.data));
  }, []);

  return (
    <div style={{ padding: '40px 8%' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '15px' }}>Our Expert Care</h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Trusted professional care for your pets from the country's leading veterinarians.
        </p>
      </header>

      {/* Vets Grid */}
      <div style={styles.vetGrid}>
        {vets.map(vet => (
          <div key={vet.id} style={styles.vetCard}>
            <div style={styles.imageBox}>
              <img src={vet.image_url} alt={vet.name} style={styles.vetImg} />
            </div>
            <div style={styles.vetInfo}>
              <div style={styles.badge}><Award size={14} /> Certified Specialist</div>
              <h3 style={styles.vetName}>{vet.name}</h3>
              <p style={styles.spec}>{vet.specialization}</p>
              <p style={styles.bio}>{vet.bio}</p>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Teaser / Info */}
      <div style={styles.infoBanner}>
        <div style={styles.infoItem}>
          <CheckCircle color="#4db6ac" />
          <span>Emergency 24/7 Support</span>
        </div>
        <div style={styles.infoItem}>
          <CheckCircle color="#4db6ac" />
          <span>Home Visit Available</span>
        </div>
        <div style={styles.infoItem}>
          <CheckCircle color="#4db6ac" />
          <span>Digital Health Records</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  vetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px', marginBottom: '60px' },
  vetCard: { backgroundColor: '#fff', borderRadius: '32px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
  imageBox: { width: '100%', height: '250px', borderRadius: '24px', overflow: 'hidden', marginBottom: '20px' },
  vetImg: { width: '100%', height: '100%', objectFit: 'cover' },
  vetName: { fontSize: '22px', fontWeight: '800', marginBottom: '5px' },
  spec: { color: '#E9DCC9', fontWeight: '700', fontSize: '14px', marginBottom: '15px', backgroundColor: '#121212', display: 'inline-block', padding: '2px 10px', borderRadius: '6px' },
  bio: { fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '20px' },
  badge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#888', marginBottom: '10px', fontWeight: '600' },
  infoBanner: { display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px', backgroundColor: '#fff', borderRadius: '24px', flexWrap: 'wrap' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }
};