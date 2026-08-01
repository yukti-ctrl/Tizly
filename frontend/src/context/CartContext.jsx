// frontend/src/context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load & Sync Logic
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        // Check if there are items in localStorage from before login
        const localCart = JSON.parse(localStorage.getItem('tizly_guest_cart') || '[]');
        
        if (localCart.length > 0) {
          // Send local items to backend to merge
          try {
            await api.post('/products/cart/sync', { items: localCart });
            localStorage.removeItem('tizly_guest_cart'); // Clear local after sync
          } catch (err) { console.error("Sync failed", err); }
        }

        // Fetch the fresh combined cart from DB
        const res = await api.get('/products/cart');
        setCart(res.data);
        setLoading(false);
      } else {
        // Not logged in: Load from localStorage
        const saved = localStorage.getItem('tizly_guest_cart');
        setCart(saved ? JSON.parse(saved) : []);
      }
    };
    loadCart();
  }, [user]);

  // 2. Add to Cart
  const addToCart = async (product) => {
    if (user) {
      // Logged in: Add to DB
      await api.post('/products/cart', { product_id: product.id });
      // Refresh cart from DB
      const res = await api.get('/products/cart');
      setCart(res.data);
    } else {
      // Logged out: Save to localStorage
      const newCart = [...cart];
      const exists = newCart.find(item => item.product_id === product.id || item.id === product.id);
      if (exists) {
        exists.quantity += 1;
      } else {
        newCart.push({ ...product, product_id: product.id, quantity: 1 });
      }
      setCart(newCart);
      localStorage.setItem('tizly_guest_cart', JSON.stringify(newCart));
    }
  };

  // 3. Remove Item
  const removeFromCart = async (itemId) => {
    if (user) {
      await api.delete(`/products/cart/${itemId}`);
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      const newCart = cart.filter(item => item.id !== itemId);
      setCart(newCart);
      localStorage.setItem('tizly_guest_cart', JSON.stringify(newCart));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);