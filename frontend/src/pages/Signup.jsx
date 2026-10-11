import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Stethoscope, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // 'user', 'seller', 'vet', 'admin'
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signupWithEmail, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (role === 'admin' && !adminCode) return setError("Please enter the Admin Registration Code.");
    
    setLoading(true);
    setError("");
    try {
      await signupWithEmail(email, password, role, adminCode);
    } catch (err) {
      console.error(err);
      setError("Account creation failed. Email may already be registered or invalid credentials.");
      setLoading(false);
    }
  };

  const roleDescriptions = {
    user: "Browse the shop, book appointments with doctors, and share moments in the community.",
    seller: "List retail pet products, food, accessories, and engage with pet parents.",
    vet: "Licensed veterinarian: list clinical vet care products, write medical updates with images, and consult.",
    admin: "Full platform monitoring, managing users & roles, reviewing products and community posts."
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>Join the Tizly Ecosystem</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Select your access role to unlock tailored dashboard features.</p>

        {/* --- 4 ROLE SELECTION GRID --- */}
        <div style={styles.roleGrid}>
          <div 
            style={{
              ...styles.roleBox, 
              borderColor: role === 'user' ? '#121212' : '#eee', 
              backgroundColor: role === 'user' ? '#F8F4F0' : '#fff'
            }} 
            onClick={() => setRole('user')}
          >
            <User size={20} color={role === 'user' ? '#121212' : '#888'} />
            <span style={{ fontWeight: '700', fontSize: '13px', color: role === 'user' ? '#121212' : '#555' }}>Parent</span>
          </div>

          <div 
            style={{
              ...styles.roleBox, 
              borderColor: role === 'vet' ? '#00796b' : '#eee', 
              backgroundColor: role === 'vet' ? '#E0F2F1' : '#fff'
            }} 
            onClick={() => setRole('vet')}
          >
            <Stethoscope size={20} color={role === 'vet' ? '#00796b' : '#888'} />
            <span style={{ fontWeight: '700', fontSize: '13px', color: role === 'vet' ? '#00796b' : '#555' }}>Vet Doctor</span>
          </div>

          <div 
            style={{
              ...styles.roleBox, 
              borderColor: role === 'seller' ? '#512DA8' : '#eee', 
              backgroundColor: role === 'seller' ? '#EDE7F6' : '#fff'
            }} 
            onClick={() => setRole('seller')}
          >
            <ShieldCheck size={20} color={role === 'seller' ? '#512DA8' : '#888'} />
            <span style={{ fontWeight: '700', fontSize: '13px', color: role === 'seller' ? '#512DA8' : '#555' }}>Seller</span>
          </div>

          <div 
            style={{
              ...styles.roleBox, 
              borderColor: role === 'admin' ? '#C62828' : '#eee', 
              backgroundColor: role === 'admin' ? '#FFEBEE' : '#fff'
            }} 
            onClick={() => setRole('admin')}
          >
            <KeyRound size={20} color={role === 'admin' ? '#C62828' : '#888'} />
            <span style={{ fontWeight: '700', fontSize: '13px', color: role === 'admin' ? '#C62828' : '#555' }}>Admin</span>
          </div>
        </div>

        {/* Role Explanation Note */}
        <div style={styles.roleDescBox}>
          {roleDescriptions[role]}
        </div>

        {error && <div style={styles.error}><AlertCircle size={16}/> {error}</div>}

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputWrapper}>
            <Mail size={18} style={styles.icon}/>
            <input 
              type="email" placeholder="Email Address" style={styles.input}
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>

          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.icon}/>
            <input 
              type="password" placeholder="Password (min 6 characters)" style={styles.input}
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>

          <div style={styles.inputWrapper}>
            <Lock size={18} style={styles.icon}/>
            <input 
              type="password" placeholder="Confirm Password" style={styles.input}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
            />
          </div>

          {/* Admin Registration Secret Field */}
          {role === 'admin' && (
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.icon}/>
              <input 
                type="password" 
                placeholder="Admin Secret Code (Default: TIZLY_ADMIN_2026)" 
                style={styles.input}
                value={adminCode} 
                onChange={(e) => setAdminCode(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : (
              <>Create {role === 'vet' ? 'Doctor' : role.charAt(0).toUpperCase() + role.slice(1)} Account <ArrowRight size={18}/></>
            )}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '50px 20px', minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf9f6' },
  card: { backgroundColor: '#fff', borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', textAlign: 'center' },
  logoBadge: { display: 'inline-block', backgroundColor: '#F8F4F0', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#121212', marginBottom: '16px' },
  title: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#121212' },
  subtitle: { fontSize: '14px', color: '#666', margin: '0 0 24px 0', lineHeight: '1.4' },
  roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' },
  roleBox: { border: '2px solid', borderRadius: '16px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease' },
  roleDescBox: { backgroundColor: '#f9f9f9', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#555', textAlign: 'left', marginBottom: '20px', lineHeight: '1.4' },
  error: { backgroundColor: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textAlign: 'left' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '16px', color: '#888' },
  input: { width: '100%', padding: '14px 14px 14px 46px', borderRadius: '14px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', backgroundColor: '#fafafa', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '6px' },
  footerText: { marginTop: '24px', fontSize: '14px', color: '#666' },
  link: { color: '#121212', fontWeight: '700', textDecoration: 'none' }
};