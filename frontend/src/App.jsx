import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Commented out to bypass the import error for testing
import Chatbot from './components/Chatbot'; 

import Landing from './pages/Landing';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Community from './pages/Community';
import Vetcare from './pages/Vetcare';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/vetcare" element={<Vetcare />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        {/* Chatbot is temporarily disabled for testing */}
        <Chatbot />
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;