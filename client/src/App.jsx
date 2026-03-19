// src/App.jsx
import { useState, useEffect } from 'react';
import './index.css';

const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: '$299',
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: '$199',
    category: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'Ultra HD 4K Monitor',
    price: '$499',
    category: 'Displays',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard Pro',
    price: '$149',
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400',
  },
];

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error fetching health check:', err));
  }, []);

  return (
    <div className="app-container">
      {/* Navbar View */}
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">ShopSmart</span>
        </div>
        <div className="nav-links">
          <a href="#discover">Discover</a>
          <a href="#categories">Categories</a>
          <div className="status-badge">
            {data ? (
              <span className="online">● System Online</span>
            ) : (
              <span className="offline">● Booting up</span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Future of <span className="gradient-text">Shopping</span>
          </h1>
          <p className="hero-subtitle">
            Discover premium tech with an elegant, streamlined checkout
            experience.
          </p>
          <button className="primary-btn">Explore Collection</button>
        </div>
      </header>

      {/* Product Showcase */}
      <section className="product-showcase" id="discover">
        <div className="section-header">
          <h2>Trending Devices</h2>
          <button className="text-btn">View All →</button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="add-to-cart">+</div>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
