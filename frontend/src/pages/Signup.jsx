import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, Stethoscope, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Options: user (Parent), seller, vet
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
    
    setLoading(true);
    setError("");
    try {
      // Logic from AuthContext: we now pass 'role' as the 3rd argument
      await signupWithEmail(email, password, role);
    } catch (err) {
      setError("Account creation failed. Email may already be in use.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>Join the Pack</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Choose how you want to join the Tizly ecosystem.</p>

        {/* --- ROLE SELECTION GRID --- */}
        <div style={styles.roleGrid}>
          <div 
            style={{...styles.roleBox, borderColor: role === 'user' ? '#121212' : '#eee', backgroundColor: role === 'user' ? '#F8F4F0' : '#fff'}} 
            onClick={() => setRole('user')}
          >
            <User size={22} color={role === 'user' ? '#121212' : '#888'} />
            <span style={{color: role === 'user' ? '#121212' : '#888'}}>Parent</span>
          </div>

          <div 
            style={{...styles.roleBox, borderColor: role === 'seller' ? '#121212' : '#eee', backgroundColor: role === 'seller' ? '#F8F4F0' : '#fff'}} 
            onClick={() => setRole('seller')}
          >
            <ShieldCheck size={22} color={role === 'seller' ? '#121212' : '#888'} />
            <span style={{color: role === 'seller' ? '#121212' : '#888'}}>Seller</span>
          </div>

          <div 
            style={{...styles.roleBox, borderColor: role === 'vet' ? '#121212' : '#eee', backgroundColor: role === 'vet' ? '#F8F4F0' : '#fff'}} 
            onClick={() => setRole('vet')}
          >
            <Stethoscope size={22} color={role === 'vet' ? '#121212' : '#888'} />
            <span style={{color: role === 'vet' ? '#121212' : '#888'}}>Vet</span>
          </div>
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
              type="password" placeholder="Password" style={styles.input}
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
          
          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : <>Create {role.charAt(0).toUpperCase() + role.slice(1)} Account <ArrowRight size={18}/></>}
          </button>
        </form>

        <div style={styles.divider}>
          <hr style={styles.hr}/> <span>OR</span> <hr style={styles.hr}/>
        </div>

        <button onClick={() => loginWithGoogle(role)} style={styles.googleBtn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18"/>
          Sign Up with Google
        </button>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '40px 20px' },
  card: { backgroundColor: '#fff', padding: '50px 40px', borderRadius: '40px', boxShadow: '0 15px 50px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px', textAlign: 'center' },
  logoBadge: { backgroundColor: '#E9DCC9', color: '#121212', padding: '6px 15px', borderRadius: '50px', display: 'inline-block', fontSize: '12px', fontWeight: '800', marginBottom: '20px' },
  title: { fontSize: '32px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' },
  subtitle: { color: '#666', marginBottom: '25px', fontSize: '15px', lineHeight: '1.5' },
  
  // ROLE SELECTION STYLES
  roleGrid: { display: 'flex', gap: '12px', marginBottom: '30px' },
  roleBox: { 
    flex: 1, 
    padding: '15px 10px', 
    border: '2px solid #eee', 
    borderRadius: '20px', 
    cursor: 'pointer', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '8px', 
    transition: 'all 0.2s ease',
    fontWeight: '700',
    fontSize: '13px'
  },

  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '18px', color: '#aaa' },
  input: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '15px', border: '1.5px solid #eee', outline: 'none', fontSize: '15px' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '15px', borderRadius: '15px', fontSize: '16px' },
  divider: { display: 'flex', alignItems: 'center', gap: '15px', margin: '30px 0' },
  hr: { flex: 1, border: 'none', borderTop: '1px solid #eee' },
  googleBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', borderRadius: '15px', border: '1.5px solid #eee', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '700', color: '#121212' },
  footerText: { marginTop: '30px', fontSize: '14px', color: '#666' },
  link: { color: '#121212', fontWeight: '800', textDecoration: 'none' },
  error: { backgroundColor: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #feb2b2' }
};