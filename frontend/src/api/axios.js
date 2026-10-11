import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

const rawBaseURL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? 'https://tizly.onrender.com' : 'http://127.0.0.1:5000');
const baseURL = String(rawBaseURL).trim().replace(/\/+$/, '');

const api = axios.create({
  baseURL,
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