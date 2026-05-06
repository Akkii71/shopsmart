import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch(() => setSystemStatus(null));
  }, [apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotal = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const items = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    fetch(`${apiUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCheckoutMsg(`Order #${data.orderId} placed! Total: $${data.total}`);
        setCart([]);
        setCartOpen(false);
      })
      .catch(() => setCheckoutMsg('Checkout failed. Please try again.'));
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">ShopSmart</span>
        </div>
        <div className="nav-links">
          <a href="#discover">Discover</a>
          <a href="#categories">Categories</a>
          <div className="status-badge">
            {systemStatus ? (
              <span className="online">● System Online</span>
            ) : (
              <span className="offline">● Offline</span>
            )}
          </div>
          <button
            className="cart-btn"
            onClick={() => setCartOpen(!cartOpen)}
            aria-label="Open cart"
          >
            Cart{' '}
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* Cart Overlay */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      )}

      {/* Cart Panel */}
      <div className={`cart-panel ${cartOpen ? 'cart-panel--open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart {cartCount > 0 && `(${cartCount})`}</h3>
          <button className="cart-close-btn" onClick={() => setCartOpen(false)}>
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">${item.price}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>${cartTotal}</strong>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Place Order →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout message */}
      {checkoutMsg && (
        <div className="checkout-msg">
          <span>✓ {checkoutMsg}</span>
          <button onClick={() => setCheckoutMsg('')}>✕</button>
        </div>
      )}

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
          <a href="#discover" className="primary-btn">
            Explore Collection
          </a>
        </div>
      </header>

      {/* Category Filter */}
      <section id="categories" className="category-section">
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'category-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="product-showcase" id="discover">
        <div className="section-header">
          <h2>Trending Devices</h2>
          <span className="product-count">
            {filteredProducts.length} products
          </span>
        </div>

        {loading ? (
          <p className="loading-msg">Loading products...</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {!product.inStock && (
                    <div className="sold-out-badge">Sold Out</div>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-footer">
                    <span className="product-price">${product.price}</span>
                    <button
                      className={`add-to-cart-btn ${!product.inStock ? 'add-to-cart-btn--disabled' : ''}`}
                      onClick={() => product.inStock && addToCart(product)}
                      disabled={!product.inStock}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
