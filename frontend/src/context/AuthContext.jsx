// src/context/AuthContext.jsx
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const res = await api.post('/auth/verify', { idToken: token });
          setUser({ ...firebaseUser, dbId: res.data.id, role: res.data.role, name: res.data.name });
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
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  
  const loginWithEmail = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

  const signupWithEmail = (email, password) => 
    createUserWithEmailAndPassword(auth, email, password);

  const resetPassword = (email) => 
    sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword, logout, loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);