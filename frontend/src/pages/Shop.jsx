import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, Loader2 } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?search=${search}`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Tizly Shop</h1>
          <p style={styles.subtitle}>Premium essentials for your pets.</p>
        </div>
        
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            style={styles.searchInput} 
            placeholder="Search products..." 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div style={styles.loaderBox}><Loader2 className="spinner" size={40} /></div>
      ) : (
        <div className="tizly-grid"> {/* Fixed CSS class */}
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div style={styles.empty}>No products found.</div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px 5% 60px 5%', width: '100%' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    flexWrap: 'wrap', 
    gap: '20px' 
  },
  titleSection: { flex: '1 1 250px' },
  title: { fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '900', margin: 0 },
  subtitle: { color: '#666', fontSize: '14px', marginTop: '4px' },
  searchWrapper: { position: 'relative', flex: '1 1 300px', maxWidth: '100%' },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' },
  searchInput: { 
    width: '100%', 
    padding: '12px 15px 12px 45px', 
    borderRadius: '12px', 
    border: '1px solid #eee', 
    outline: 'none', 
    fontSize: '14px',
    backgroundColor: '#fff'
  },
  loaderBox: { display: 'flex', justifyContent: 'center', padding: '100px 0' },
  empty: { gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#888', fontWeight: '600' }
};