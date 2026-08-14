import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

const api = axios.create({
  // Use the IP address of your laptop instead of localhost 
  // so your phone can reach the backend too.
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://10.168.155.161:5000',
});

// Automatically attach Firebase Token to every request
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