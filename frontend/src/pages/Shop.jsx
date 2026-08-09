import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get(`/products?search=${search}`)
       .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
       .catch(() => setProducts([]));
  }, [search]);

  return (
    <div style={{ padding: '40px 8%' }}>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <h1 style={{ fontSize: '36px', fontWeight: '800' }}>Tizly Shop</h1>
        <input 
          style={{padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', width: '300px'}} 
          placeholder="Search products..." 
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <div style={styles.grid}>
        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '50px'}}>
             <h3>No products found</h3>
             <p>Our shelves are being restocked. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }
};