import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Food', 'Toys', 'Accessories', 'Supplies'];

  useEffect(() => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    api.get(`/products?${params.toString()}`).then(res => setProducts(res.data));
  }, [category, search]);

  return (
    <div style={{ padding: '40px 8%' }}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800' }}>Tizly Shop</h1>
          <p style={{ color: '#666' }}>Quality essentials for your furry friends.</p>
        </div>
        
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <Search size={18} color="#888" />
            <input 
              style={styles.searchInput} 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div style={styles.categoryList}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)}
            style={{
              ...styles.catBtn,
              backgroundColor: category === cat || (cat === 'All' && !category) ? '#121212' : '#fff',
              color: category === cat || (cat === 'All' && !category) ? '#fff' : '#121212'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {products.length > 0 ? (
          products.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>No products found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
  filterBar: { display: 'flex', gap: '15px' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '15px', border: '1px solid #eee' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '200px' },
  categoryList: { display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' },
  catBtn: { padding: '8px 20px', borderRadius: '10px', border: '1px solid #eee', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }
};