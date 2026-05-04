import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutMsg, setCheckoutMsg] = useState('');

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
              <span className="offline">● Booting up</span>
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

      {/* Cart Panel */}
      {cartOpen && (
        <div className="cart-panel">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <span>
                      x{item.quantity} — ${item.price * item.quantity}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <strong>Total: ${cartTotal}</strong>
                <button className="primary-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Checkout message */}
      {checkoutMsg && (
        <div className="checkout-msg">
          {checkoutMsg}
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
          <button className="primary-btn" onClick={() => setCartOpen(false)}>
            Explore Collection
          </button>
        </div>
      </header>

      {/* Product Showcase */}
      <section className="product-showcase" id="discover">
        <div className="section-header">
          <h2>Trending Devices</h2>
          <button className="text-btn">View All →</button>
        </div>

        {loading ? (
          <p className="loading-msg">Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button
                    className="add-to-cart"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {product.inStock ? '+' : '✕'}
                  </button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">${product.price}</span>
                  {!product.inStock && (
                    <span className="out-of-stock">Out of stock</span>
                  )}
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
