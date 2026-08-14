import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig.js';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signupRole, setSignupRole] = useState('user'); // Stores role temporarily

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        try {
          const res = await api.post('/auth/verify', { 
            idToken: token, 
            role: signupRole 
          });
          setUser({ ...firebaseUser, ...res.data });
        } catch (err) {
          console.error("Auth sync failed", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [signupRole]);

  const loginWithGoogle = (role = 'user') => {
    setSignupRole(role);
    return signInWithPopup(auth, googleProvider);
  };
  
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signupWithEmail = (email, password, role) => {
    setSignupRole(role);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginWithEmail, signupWithEmail, logout, resetPassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);