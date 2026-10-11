import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { loginWithEmail, loginWithGoogle, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      // Redirect handled by useEffect
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google sign-in error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("Domain not authorized: Please add your Netlify site domain in Firebase Console -> Authentication -> Settings -> Authorized Domains.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked by browser. Redirecting...");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. Please tap 'Continue with Google' again.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) return setError("Please enter your email address first.");
    try {
      await resetPassword(email);
      setResetSent(true);
      setError("");
    } catch (err) {
      setError("Failed to send reset email.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>Tizly</div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Manage your pet's care and shopping in one place.</p>

        {error && <div style={styles.error}><AlertCircle size={16}/> {error}</div>}
        {resetSent && <div style={styles.success}>Password reset link sent to your inbox!</div>}

        <form onSubmit={handleEmailLogin} style={styles.form}>
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
          
          <div style={{textAlign: 'right'}}>
            <button type="button" onClick={handleForgot} style={styles.forgotLink}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : <>Login <ArrowRight size={18}/></>}
          </button>
        </form>

        <div style={styles.divider}>
          <hr style={styles.hr}/> <span>OR</span> <hr style={styles.hr}/>
        </div>

        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18"/>
          Continue with Google
        </button>

        <p style={styles.footerText}>
          New to Tizly? <Link to="/signup" style={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '50px 40px', borderRadius: '40px', boxShadow: '0 15px 50px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px', textAlign: 'center' },
  logoBadge: { backgroundColor: '#E9DCC9', color: '#121212', padding: '6px 15px', borderRadius: '50px', display: 'inline-block', fontSize: '12px', fontWeight: '800', marginBottom: '20px' },
  title: { fontSize: '32px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '15px', lineHeight: '1.5' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '18px', color: '#aaa' },
  input: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '15px', border: '1.5px solid #eee', outline: 'none', fontSize: '15px', transition: 'border 0.2s' },
  forgotLink: { background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '15px', borderRadius: '15px', fontSize: '16px' },
  divider: { display: 'flex', alignItems: 'center', gap: '15px', margin: '30px 0' },
  hr: { flex: 1, border: 'none', borderTop: '1px solid #eee' },
  googleBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', borderRadius: '15px', border: '1.5px solid #eee', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '700', color: '#121212' },
  footerText: { marginTop: '30px', fontSize: '14px', color: '#666' },
  link: { color: '#121212', fontWeight: '800', textDecoration: 'none' },
  error: { backgroundColor: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #feb2b2' },
  success: { backgroundColor: '#f0fff4', color: '#38a169', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', border: '1px solid #9ae6b4' }
};