import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig.js';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signupRole, setSignupRole] = useState('user');
  const [adminCode, setAdminCode] = useState('');

  const syncUserWithBackend = useCallback(async (firebaseUser, roleOverride, codeOverride) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    try {
      const token = await firebaseUser.getIdToken();
      const res = await api.post('/auth/verify', { 
        idToken: token, 
        role: roleOverride || signupRole,
        adminCode: codeOverride || adminCode
      });
      
      const resolvedPhoto = firebaseUser.photoURL || res.data.photo_url || res.data.photoURL || '';
      const resolvedName = res.data.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Pet Lover');

      const combinedUser = {
        // Explicitly extract getters from Firebase User
        uid: firebaseUser.uid,
        email: firebaseUser.email || res.data.email,
        displayName: resolvedName,
        name: resolvedName,
        photoURL: resolvedPhoto,
        photo_url: resolvedPhoto,
        role: res.data.role || 'user',
        id: res.data.id,
        // Attach helper to get fresh JWT token
        getIdToken: () => firebaseUser.getIdToken()
      };
      
      setUser(combinedUser);
    } catch (err) {
      console.error("Auth sync failed", err);
      // Fallback: preserve Firebase Auth info so UI never loses identity
      const fallbackName = firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Pet Lover');
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: fallbackName,
        name: fallbackName,
        photoURL: firebaseUser.photoURL || '',
        photo_url: firebaseUser.photoURL || '',
        role: 'user',
        getIdToken: () => firebaseUser.getIdToken()
      });
    }
  }, [signupRole, adminCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserWithBackend(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [syncUserWithBackend]);

  const loginWithGoogle = async (role = 'user', code = '') => {
    setSignupRole(role);
    setAdminCode(code);
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserWithBackend(result.user, role, code);
    }
    return result;
  };
  
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signupWithEmail = async (email, password, role = 'user', code = '') => {
    setSignupRole(role);
    setAdminCode(code);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) {
      await syncUserWithBackend(cred.user, role, code);
    }
    return cred;
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateUserProfile = async ({ name, photo_url }) => {
    try {
      // 1. Update in backend & database
      const res = await api.put('/auth/profile', { name, photo_url });
      
      // 2. Update in Firebase client if active
      if (auth.currentUser) {
        const fbUpdates = {};
        if (name) fbUpdates.displayName = name;
        if (photo_url) fbUpdates.photoURL = photo_url;
        if (Object.keys(fbUpdates).length > 0) {
          await updateFirebaseProfile(auth.currentUser, fbUpdates);
        }
      }

      // 3. Update local React state
      setUser(prev => ({
        ...prev,
        ...res.data,
        name: res.data.name || name || prev.name,
        displayName: res.data.name || name || prev.displayName,
        photoURL: res.data.photo_url || photo_url || prev.photoURL,
        photo_url: res.data.photo_url || photo_url || prev.photo_url
      }));

      return res.data;
    } catch (err) {
      console.error("Failed to update profile", err);
      throw err;
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await syncUserWithBackend(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      loginWithEmail, 
      signupWithEmail, 
      logout, 
      resetPassword, 
      loading,
      updateUserProfile,
      refreshUser 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);