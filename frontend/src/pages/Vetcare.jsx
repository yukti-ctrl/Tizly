import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  Loader2, 
  Calendar, 
  Clock, 
  X, 
  User as UserIcon,
  LogIn
} from 'lucide-react';

export default function Vetcare() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking modal state
  const [bookingVet, setBookingVet] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointment, setAppointment] = useState({
    pet_name: '',
    pet_type: 'Dog',
    reason: 'Routine Health Checkup',
    preferred_date: ''
  });

  useEffect(() => {
    api.get('/vets')
      .then(res => setVets(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookClick = (vet) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingVet(vet);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!appointment.pet_name || !appointment.preferred_date) return;

    setBookingSubmitting(true);
    try {
      await api.post('/vets/appointments', {
        vet_id: bookingVet.id,
        pet_name: appointment.pet_name,
        pet_type: appointment.pet_type,
        reason: appointment.reason,
        preferred_date: appointment.preferred_date
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingVet(null);
        setBookingSuccess(false);
        setAppointment({
          pet_name: '',
          pet_type: 'Dog',
          reason: 'Routine Health Checkup',
          preferred_date: ''
        });
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to schedule appointment.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Professional Vetcare</h1>
        <p style={styles.subtitle}>Connecting you with certified veterinary surgeons and animal care specialists.</p>
      </header>

      {/* GUEST BANNER */}
      {!user && (
        <div style={styles.guestBanner}>
          <p style={{ margin: 0, fontWeight: '500' }}>
            🩺 Vet listings and clinic profiles are public. Log in to book an appointment with a specialist.
          </p>
          <button onClick={() => navigate('/login')} style={styles.guestBannerBtn}>
            <LogIn size={14} /> Log In to Book
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.center}><Loader2 className="spinner" size={40}/></div>
      ) : (
        <div className="vet-grid">
          {vets.map(vet => (
            <div key={vet.id} style={styles.vetCard}>
              <div style={styles.imageBox}>
                <img 
                  src={vet.image_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80"} 
                  alt={vet.name} 
                  style={styles.vetImg} 
                />
                <div style={styles.ratingBadge}><Star size={12} fill="#FFB800" /> 4.9</div>
              </div>
              
              <div style={styles.vetInfo}>
                <div style={styles.tag}><Award size={14} /> Certified Specialist</div>
                <h3 style={styles.vetName}>{vet.name}</h3>
                <p style={styles.spec}>{vet.specialization}</p>
                <p style={styles.bio}>{vet.bio}</p>
                
                <div style={styles.slots}>
                  <Clock size={14} color="#00796b" />
                  <span>{vet.available_slots || "Mon - Fri: 9 AM - 5 PM"}</span>
                </div>

                <div style={styles.features}>
                  <div style={styles.feat}><CheckCircle size={14} color="#4db6ac"/> Clinic Visit</div>
                  <div style={styles.feat}><CheckCircle size={14} color="#4db6ac"/> Online Triage</div>
                </div>

                <button 
                  className="btn-primary" 
                  style={styles.bookBtn}
                  onClick={() => handleBookClick(vet)}
                >
                  <Calendar size={16} /> Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 24/7 SUPPORT BANNER */}
      <div style={styles.emergencyBox}>
        <div style={styles.emergencyIcon}><ShieldCheck size={30} /></div>
        <div>
          <h4 style={{ margin: 0 }}>Emergency 24/7 Triage Support</h4>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            Our veterinary medical board is always online for urgent cases and second opinions.
          </p>
        </div>
      </div>

      {/* APPOINTMENT BOOKING MODAL */}
      {bookingVet && (
        <div style={styles.modalOverlay} onClick={() => setBookingVet(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>Book with {bookingVet.name}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  {bookingVet.specialization}
                </p>
              </div>
              <button style={styles.closeBtn} onClick={() => setBookingVet(null)}>
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={styles.successBox}>
                <CheckCircle size={44} color="#2e7d32" />
                <h3>Appointment Request Submitted!</h3>
                <p style={{ color: '#666' }}>
                  {bookingVet.name} will review your request and confirm the schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={styles.modalForm}>
                <div style={styles.formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Pet Name *</label>
                    <input 
                      style={styles.input}
                      required
                      placeholder="e.g. Milo"
                      value={appointment.pet_name}
                      onChange={e => setAppointment({ ...appointment, pet_name: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Pet Type</label>
                    <select 
                      style={styles.input}
                      value={appointment.pet_type}
                      onChange={e => setAppointment({ ...appointment, pet_type: e.target.value })}
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Preferred Date & Time *</label>
                  <input 
                    type="datetime-local"
                    style={styles.input}
                    required
                    value={appointment.preferred_date}
                    onChange={e => setAppointment({ ...appointment, preferred_date: e.target.value })}
                  />
                </div>

                <div>
                  <label style={styles.label}>Reason for Visit</label>
                  <textarea 
                    style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                    placeholder="Describe symptoms, routine checkup, vaccination needs, or questions..."
                    value={appointment.reason}
                    onChange={e => setAppointment({ ...appointment, reason: e.target.value })}
                  />
                </div>

                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    style={styles.cancelBtn} 
                    onClick={() => setBookingVet(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={bookingSubmitting}
                    style={{ minWidth: '150px' }}
                  >
                    {bookingSubmitting ? <Loader2 className="spinner" size={18} /> : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '40px 5%', maxWidth: '1400px', margin: '0 auto', minHeight: '85vh' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#121212', margin: '0 0 8px 0' },
  subtitle: { fontSize: '15px', color: '#666', margin: 0 },
  guestBanner: {
    backgroundColor: '#E0F2F1',
    border: '1px solid #B2DFDB',
    color: '#00695C',
    padding: '14px 20px',
    borderRadius: '16px',
    marginBottom: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  guestBannerBtn: {
    backgroundColor: '#00695C',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' },
  vetCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column'
  },
  imageBox: { height: '220px', position: 'relative', overflow: 'hidden' },
  vetImg: { width: '100%', height: '100%', objectFit: 'cover' },
  ratingBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#fff',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  vetInfo: { padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 },
  tag: { fontSize: '11px', color: '#00796b', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  vetName: { margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#121212' },
  spec: { margin: '0 0 10px 0', fontSize: '13px', color: '#00796b', fontWeight: '600' },
  bio: { fontSize: '13px', color: '#666', lineHeight: '1.5', margin: '0 0 16px 0', flex: 1 },
  slots: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#444', marginBottom: '14px', backgroundColor: '#f9f9f9', padding: '8px 12px', borderRadius: '10px' },
  features: { display: 'flex', gap: '14px', marginBottom: '18px', fontSize: '12px', color: '#555' },
  feat: { display: 'flex', alignItems: 'center', gap: '6px' },
  bookBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  emergencyBox: {
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: '24px',
    padding: '24px 30px',
    marginTop: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  emergencyIcon: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'flex', gap: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' },
  cancelBtn: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  successBox: { textAlign: 'center', padding: '30px 20px' }
};