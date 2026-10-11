import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000',
});

// Automatically attach Firebase ID Token to every request when logged in
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Token attachment failed", err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;