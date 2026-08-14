import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Package, Calendar, Settings, LogOut, ShieldCheck, Stethoscope } from 'lucide-react';
import SellerDashboard from '../components/SellerDashboard';
import VetDashboard from '../components/VetDashboard';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return <div style={styles.center}>Please log in to view your profile.</div>;

  return (
    <div style={styles.container}>
      {/* SIDEBAR / HEADER (Responsive) */}
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.profileHeader}>
            <div style={styles.avatarLarge}>
              {user.photoURL ? <img src={user.photoURL} style={styles.img} /> : <User size={40} />}
            </div>
            <h2 style={styles.name}>{user.name}</h2>
            <div style={styles.roleBadge}>
               {user.role === 'seller' && <ShieldCheck size={14}/>}
               {user.role === 'vet' && <Stethoscope size={14}/>}
               <span style={{textTransform: 'uppercase'}}>{user.role} Account</span>
            </div>
          </div>

          <nav style={styles.sideNav}>
            <button style={styles.navItemActive}><Settings size={18}/> Account Settings</button>
            <button style={styles.navItem} onClick={logout}><LogOut size={18}/> Logout</button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={styles.mainContent}>
          {user.role === 'seller' ? (
            <SellerDashboard />
          ) : user.role === 'vet' ? (
            <VetDashboard />
          ) : (
            <div style={styles.userView}>
              <h3 style={{marginBottom: '20px'}}>My Activity</h3>
              <div style={styles.emptyState}>
                <Package size={48} color="#ccc" />
                <p>No orders yet. Your pet is waiting for treats!</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', minHeight: '80vh' },
  layout: { display: 'flex', flexWrap: 'wrap', gap: '40px' },
  sidebar: { flex: '1 1 250px', backgroundColor: '#fff', borderRadius: '32px', padding: '40px 20px', height: 'fit-content', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  avatarLarge: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#F8F4F0', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  name: { fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0' },
  roleBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#121212', color: '#fff', padding: '5px 15px', borderRadius: '50px', fontSize: '10px', fontWeight: '700' },
  sideNav: { marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', color: '#666', width: '100%' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#F8F4F0', fontWeight: '800', color: '#121212', width: '100%' },
  mainContent: { flex: '3 1 500px' },
  emptyState: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '32px' },
  center: { display: 'flex', justifyContent: 'center', padding: '100px 0', fontWeight: '700' }
};