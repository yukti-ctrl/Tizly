import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  Package, 
  Calendar, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Stethoscope, 
  KeyRound, 
  Clock,
  Save,
  CheckCircle,
  Loader2,
  LayoutDashboard,
  Mail,
  Fingerprint
} from 'lucide-react';
import SellerDashboard from '../components/SellerDashboard';
import VetDashboard from '../components/VetDashboard';
import AdminDashboard from '../components/AdminDashboard';
import ImageUploader from '../components/ImageUploader';
import api from '../api/axios';

export default function Profile() {
  const { user, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'settings'
  const [appointments, setAppointments] = useState([]);
  
  // Profile edit form state
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || user.displayName || '');
      setEditPhoto(user.photoURL || user.photo_url || '');

      if (user.role === 'user') {
        api.get('/vets/appointments')
          .then(res => setAppointments(Array.isArray(res.data) ? res.data : []))
          .catch(err => console.error(err));
      }
    }
  }, [user]);

  if (!user) return <div style={styles.center}>Please log in to view your profile.</div>;

  const avatar = user.photoURL || user.photo_url;
  const initial = (user.name || user.displayName || user.email || 'U').charAt(0).toUpperCase();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    try {
      await updateUserProfile({
        name: editName,
        photo_url: editPhoto
      });
      setSaveSuccess('Profile successfully updated across Firebase & database!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.profileHeader}>
            <div style={styles.avatarLarge}>
              {avatar ? (
                <img src={avatar} alt="Profile" style={styles.img} />
              ) : (
                <span style={styles.avatarInitial}>{initial}</span>
              )}
            </div>
            <h2 style={styles.name}>{user.name || user.displayName || 'Pet Parent'}</h2>
            <p style={styles.emailText}>{user.email}</p>

            <div style={{
              ...styles.roleBadge,
              backgroundColor: 
                user.role === 'admin' ? '#C62828' :
                user.role === 'vet' ? '#00695C' :
                user.role === 'seller' ? '#512DA8' : '#121212'
            }}>
              {user.role === 'admin' && <KeyRound size={13} />}
              {user.role === 'seller' && <ShieldCheck size={13} />}
              {user.role === 'vet' && <Stethoscope size={13} />}
              {user.role === 'user' && <UserIcon size={13} />}
              <span style={{ textTransform: 'uppercase' }}>{user.role} Account</span>
            </div>
          </div>

          <nav style={styles.sideNav}>
            <button 
              style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem} 
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18}/> 
              <span>{user.role === 'admin' ? 'Admin Panel' : user.role === 'vet' ? 'Doctor Schedule' : user.role === 'seller' ? 'Seller Panel' : 'My Activity'}</span>
            </button>

            <button 
              style={activeTab === 'settings' ? styles.navItemActive : styles.navItem} 
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18}/> <span>Account Profile</span>
            </button>

            <button style={styles.logoutBtn} onClick={logout}>
              <LogOut size={18}/> <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={styles.mainContent}>
          {activeTab === 'settings' ? (
            /* ACCOUNT SETTINGS & FIREBASE PROFILE VIEW */
            <div style={styles.card}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800' }}>Firebase Account Details</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
                Your identity is managed securely by Firebase Authentication.
              </p>

              {saveSuccess && (
                <div style={styles.successBanner}>
                  <CheckCircle size={16} /> {saveSuccess}
                </div>
              )}

              {/* READ-ONLY FIREBASE DETAILS */}
              <div style={styles.metaGrid}>
                <div style={styles.metaItem}>
                  <Mail size={16} color="#00796b" />
                  <div>
                    <label style={styles.metaLabel}>Verified Email</label>
                    <span style={styles.metaVal}>{user.email || 'N/A'}</span>
                  </div>
                </div>

                <div style={styles.metaItem}>
                  <Fingerprint size={16} color="#00796b" />
                  <div>
                    <label style={styles.metaLabel}>Firebase UID</label>
                    <span style={{ ...styles.metaVal, fontFamily: 'monospace', fontSize: '12px' }}>
                      {user.uid || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* EDITABLE PROFILE FORM */}
              <form onSubmit={handleSaveProfile} style={styles.form}>
                <div>
                  <label style={styles.label}>Display Name</label>
                  <input 
                    style={styles.input} 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                  />
                </div>

                {/* AVATAR UPLOADER */}
                <ImageUploader 
                  folder="avatars"
                  label="Profile Picture (Supabase Storage or Firebase Photo)"
                  value={editPhoto}
                  onChange={url => setEditPhoto(url)}
                />

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '160px', width: 'fit-content', marginTop: '10px' }}
                >
                  {saving ? <Loader2 className="spinner" size={18} /> : <><Save size={16} /> Save Changes</>}
                </button>
              </form>
            </div>
          ) : (
            /* ROLE-BASED DASHBOARD */
            user.role === 'admin' ? (
              <AdminDashboard />
            ) : user.role === 'vet' ? (
              <VetDashboard />
            ) : user.role === 'seller' ? (
              <SellerDashboard />
            ) : (
              <div style={styles.userView}>
                <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '800' }}>My Booked Vet Consultations</h3>
                {appointments.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                    {appointments.map(a => (
                      <div key={a.id} style={styles.userAppCard}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0' }}>{a.pet_name} ({a.pet_type}) with {a.vet_name}</h4>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>{a.reason}</p>
                          <span style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {a.preferred_date}
                          </span>
                        </div>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: a.status === 'confirmed' ? '#E8F5E9' : '#FFF8E1',
                          color: a.status === 'confirmed' ? '#2E7D32' : '#F57F17'
                        }}>
                          {a.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <Calendar size={44} color="#ccc" style={{ marginBottom: '10px' }} />
                    <p style={{ color: '#777' }}>No veterinary appointments booked yet.</p>
                  </div>
                )}

                <h3 style={{ margin: '30px 0 20px 0', fontSize: '20px', fontWeight: '800' }}>Order History</h3>
                <div style={styles.emptyState}>
                  <Package size={44} color="#ccc" style={{ marginBottom: '10px' }} />
                  <p style={{ color: '#777' }}>No past orders found. Explore organic pet food and toys in our shop!</p>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', minHeight: '80vh', maxWidth: '1400px', margin: '0 auto' },
  layout: { display: 'flex', flexWrap: 'wrap', gap: '40px' },
  sidebar: { flex: '1 1 270px', backgroundColor: '#fff', borderRadius: '32px', padding: '36px 20px', height: 'fit-content', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' },
  profileHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  avatarLarge: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#121212', color: '#fff', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid #f0f0f0' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitial: { fontSize: '36px', fontWeight: '800' },
  name: { fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: '#121212' },
  emailText: { fontSize: '13px', color: '#777', margin: '0 0 14px 0' },
  roleBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: '700' },
  sideNav: { marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', color: '#666', width: '100%', textAlign: 'left' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px', border: 'none', backgroundColor: '#F8F4F0', fontWeight: '800', color: '#121212', width: '100%', textAlign: 'left' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', color: '#ff5252', width: '100%', marginTop: '10px' },
  mainContent: { flex: '3 1 600px' },
  card: { backgroundColor: '#fff', padding: '32px', borderRadius: '28px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '16px', backgroundColor: '#f9f9f9', border: '1px solid #eee' },
  metaLabel: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase' },
  metaVal: { fontSize: '14px', fontWeight: '600', color: '#121212' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  successBanner: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '12px 18px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '20px' },
  userView: { display: 'flex', flexDirection: 'column' },
  userAppCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '18px 20px', borderRadius: '18px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  statusBadge: { padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' },
  emptyState: { textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f0f0f0' },
  center: { display: 'flex', justifyContent: 'center', padding: '100px 0', fontWeight: '700' }
};