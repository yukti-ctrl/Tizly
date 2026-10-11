import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ImageUploader from './ImageUploader';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Plus, 
  Save 
} from 'lucide-react';

export default function VetDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'add-product', 'profile'
  
  // Doctor Profile state
  const [profile, setProfile] = useState({
    specialization: 'General Pet Medicine & Surgery',
    bio: 'Dedicated veterinarian committed to pet well-being.',
    available_slots: 'Mon - Fri: 9:00 AM - 5:00 PM',
    image_url: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Vet Care Product state
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'Vet Care',
    description: '',
    image_url: '',
    stock: 20
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productSuccess, setProductSuccess] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/vets/appointments');
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appId, status) => {
    try {
      await api.put(`/vets/appointments/${appId}/status`, { status });
      setAppointments(appointments.map(a => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      alert("Failed to update appointment status.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/vets/profile', profile);
      setProfileMsg('Doctor profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);
    try {
      await api.post('/products', {
        ...product,
        price: parseFloat(product.price)
      });
      setProductSuccess(true);
      setProduct({
        name: '',
        price: '',
        category: 'Vet Care',
        description: '',
        image_url: '',
        stock: 20
      });
      setTimeout(() => setProductSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to list vet care product.");
    } finally {
      setSubmittingProduct(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        <button 
          style={{ ...styles.tabBtn, borderBottom: activeTab === 'appointments' ? '2px solid #00796b' : 'none', color: activeTab === 'appointments' ? '#00796b' : '#666' }}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} /> Appointments Schedule ({appointments.length})
        </button>
        <button 
          style={{ ...styles.tabBtn, borderBottom: activeTab === 'add-product' ? '2px solid #00796b' : 'none', color: activeTab === 'add-product' ? '#00796b' : '#666' }}
          onClick={() => setActiveTab('add-product')}
        >
          <Plus size={16} /> Add Vet Care Product
        </button>
        <button 
          style={{ ...styles.tabBtn, borderBottom: activeTab === 'profile' ? '2px solid #00796b' : 'none', color: activeTab === 'profile' ? '#00796b' : '#666' }}
          onClick={() => setActiveTab('profile')}
        >
          <Stethoscope size={16} /> Doctor Profile
        </button>
      </div>

      {/* 1. APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Patient Consultations</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={30} /></div>
          ) : appointments.length === 0 ? (
            <div style={styles.emptyState}>
              <Calendar size={44} color="#ccc" />
              <p>No appointment requests scheduled yet.</p>
            </div>
          ) : (
            <div style={styles.appList}>
              {appointments.map(a => (
                <div key={a.id} style={styles.appItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>{a.pet_name} ({a.pet_type})</h4>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: 
                          a.status === 'confirmed' ? '#E8F5E9' :
                          a.status === 'completed' ? '#E0F2F1' :
                          a.status === 'cancelled' ? '#FFEBEE' : '#FFF8E1',
                        color:
                          a.status === 'confirmed' ? '#2E7D32' :
                          a.status === 'completed' ? '#00695C' :
                          a.status === 'cancelled' ? '#C62828' : '#F57F17'
                      }}>
                        {a.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#555' }}>
                      <strong>Parent:</strong> {a.patient_name} ({a.patient_email})
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#555' }}>
                      <strong>Reason:</strong> {a.reason}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                      <Clock size={12} style={{ marginRight: '4px' }} />
                      Preferred Date: {a.preferred_date}
                    </p>
                  </div>

                  <div style={styles.appActions}>
                    {a.status === 'pending' && (
                      <button 
                        style={styles.confirmBtn} 
                        onClick={() => handleStatusChange(a.id, 'confirmed')}
                      >
                        <CheckCircle size={14} /> Accept
                      </button>
                    )}
                    {a.status === 'confirmed' && (
                      <button 
                        style={styles.completeBtn} 
                        onClick={() => handleStatusChange(a.id, 'completed')}
                      >
                        <CheckCircle size={14} /> Complete
                      </button>
                    )}
                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                      <button 
                        style={styles.cancelAppBtn} 
                        onClick={() => handleStatusChange(a.id, 'cancelled')}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. ADD VET PRODUCT TAB */}
      {activeTab === 'add-product' && (
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>List Medical / Vet Care Item</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#666' }}>
            As a certified doctor, you can list prescription diets, supplements, dental hygiene products, and wellness supplies.
          </p>

          {productSuccess && (
            <div style={styles.successBanner}>
              <CheckCircle size={16} /> Vet Care item published to the public shop!
            </div>
          )}

          <form onSubmit={handleAddProduct} style={styles.form}>
            <div style={styles.formRow}>
              <div style={{ flex: 2 }}>
                <label style={styles.label}>Product Name *</label>
                <input 
                  style={styles.input} 
                  required
                  placeholder="e.g. Enzymatic Joint Support Chews"
                  value={product.name}
                  onChange={e => setProduct({ ...product, name: e.target.value })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  style={styles.input} 
                  required
                  placeholder="34.99"
                  value={product.price}
                  onChange={e => setProduct({ ...product, price: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Category</label>
                <select 
                  style={styles.input}
                  value={product.category}
                  onChange={e => setProduct({ ...product, category: e.target.value })}
                >
                  <option value="Vet Care">Vet Care (Clinical & Health)</option>
                  <option value="Food">Medical / Prescription Food</option>
                  <option value="Supplies">Clinical Supplies</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Stock</label>
                <input 
                  type="number" 
                  style={styles.input}
                  value={product.stock}
                  onChange={e => setProduct({ ...product, stock: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={styles.label}>Clinical Description & Dosage</label>
              <textarea 
                style={{ ...styles.input, height: '90px', resize: 'vertical' }}
                placeholder="Recommended usage, pet weights, active ingredients..."
                value={product.description}
                onChange={e => setProduct({ ...product, description: e.target.value })}
              />
            </div>

            <ImageUploader 
              folder="products"
              label="Product Image (Supabase Storage)"
              value={product.image_url}
              onChange={url => setProduct({ ...product, image_url: url })}
            />

            <button type="submit" className="btn-primary" disabled={submittingProduct} style={{ marginTop: '10px' }}>
              {submittingProduct ? <Loader2 className="spinner" size={18} /> : 'Publish to Shop'}
            </button>
          </form>
        </div>
      )}

      {/* 3. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Doctor Directory Profile</h3>

          {profileMsg && (
            <div style={styles.successBanner}>
              <CheckCircle size={16} /> {profileMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={styles.form}>
            <div>
              <label style={styles.label}>Specialization</label>
              <input 
                style={styles.input}
                placeholder="e.g. Feline Behavior, Veterinary Nutrition, Surgery"
                value={profile.specialization}
                onChange={e => setProfile({ ...profile, specialization: e.target.value })}
              />
            </div>

            <div>
              <label style={styles.label}>Available Hours / Consultation Slots</label>
              <input 
                style={styles.input}
                placeholder="e.g. Mon - Fri: 9:00 AM - 5:00 PM"
                value={profile.available_slots}
                onChange={e => setProfile({ ...profile, available_slots: e.target.value })}
              />
            </div>

            <div>
              <label style={styles.label}>Doctor Bio</label>
              <textarea 
                style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                placeholder="Brief introduction of credentials, experience, and animal care philosophy..."
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <ImageUploader 
              folder="avatars"
              label="Doctor Portrait (Supabase Storage)"
              value={profile.image_url}
              onChange={url => setProfile({ ...profile, image_url: url })}
            />

            <button type="submit" className="btn-primary" disabled={savingProfile} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              {savingProfile ? <Loader2 className="spinner" size={18} /> : <><Save size={16} /> Save Doctor Profile</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  tabBar: { display: 'flex', gap: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px', overflowX: 'auto' },
  tabBtn: { background: 'none', border: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#888' },
  appList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  appItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', backgroundColor: '#fafafa', border: '1px solid #eee', flexWrap: 'wrap', gap: '14px' },
  statusBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' },
  appActions: { display: 'flex', gap: '8px' },
  confirmBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  completeBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#00695C', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  cancelAppBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', color: '#C62828', border: '1px solid #C62828', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  successBanner: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '12px 18px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'flex', gap: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }
};