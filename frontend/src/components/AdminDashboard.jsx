import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Package, 
  MessageSquare, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  CheckCircle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setSuccessMsg(`User role updated to ${newRole}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Loader2 className="spinner" size={36} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '800' }}>Admin Command Center</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Monitor and manage all ecosystem resources, users, products, and roles.
          </p>
        </div>
        <button onClick={fetchData} style={styles.refreshBtn} title="Refresh Data">
          <RefreshCw size={16} /> <span>Refresh</span>
        </button>
      </div>

      {successMsg && (
        <div style={styles.successBanner}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* METRIC CARDS */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#E3F2FD', color: '#1565C0' }}><Users size={22} /></div>
            <div>
              <span style={styles.statLabel}>Total Users</span>
              <h3 style={styles.statValue}>{stats.total_users}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#FFF3E0', color: '#E65100' }}><Package size={22} /></div>
            <div>
              <span style={styles.statLabel}>Products</span>
              <h3 style={styles.statValue}>{stats.total_products}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#E8F5E9', color: '#2E7D32' }}><MessageSquare size={22} /></div>
            <div>
              <span style={styles.statLabel}>Community Posts</span>
              <h3 style={styles.statValue}>{stats.total_posts}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#E0F2F1', color: '#00695C' }}><Stethoscope size={22} /></div>
            <div>
              <span style={styles.statLabel}>Active Doctors</span>
              <h3 style={styles.statValue}>{stats.total_vets}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#F3E5F5', color: '#7B1FA2' }}><Calendar size={22} /></div>
            <div>
              <span style={styles.statLabel}>Appointments</span>
              <h3 style={styles.statValue}>{stats.total_appointments}</h3>
            </div>
          </div>
        </div>
      )}

      {/* USER ACCESS & ROLE MANAGEMENT TABLE */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>User Access & Role Management</h3>
          <span style={{ fontSize: '13px', color: '#888' }}>{users.length} registered accounts</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Current Role</th>
                <th style={styles.th}>Change Access Level</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600', color: '#121212' }}>{u.name}</div>
                    <span style={{ fontSize: '11px', color: '#888' }}>ID #{u.id}</span>
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: 
                        u.role === 'admin' ? '#FFEBEE' :
                        u.role === 'vet' ? '#E0F2F1' :
                        u.role === 'seller' ? '#EDE7F6' : '#F5F5F5',
                      color:
                        u.role === 'admin' ? '#C62828' :
                        u.role === 'vet' ? '#00695C' :
                        u.role === 'seller' ? '#512DA8' : '#616161'
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <select
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={styles.roleSelect}
                    >
                      <option value="user">User (Pet Parent)</option>
                      <option value="vet">Vet Doctor (Clinical)</option>
                      <option value="seller">Seller (Merchant)</option>
                      <option value="admin">Admin (Full Control)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  successBanner: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' },
  statCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '18px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
  statIcon: { width: '46px', height: '46px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '2px' },
  statValue: { margin: 0, fontSize: '20px', fontWeight: '800', color: '#121212' },
  tableCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '1px solid #eee' },
  th: { padding: '12px 14px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '14px', fontSize: '13px', color: '#444' },
  badge: { display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },
  roleSelect: { padding: '8px 12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '13px', backgroundColor: '#fafafa', cursor: 'pointer', outline: 'none' }
};
