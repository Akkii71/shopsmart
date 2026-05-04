const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory product catalogue
const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400',
    inStock: true,
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 199,
    category: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400',
    inStock: true,
  },
  {
    id: 3,
    name: 'Ultra HD 4K Monitor',
    price: 499,
    category: 'Displays',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
    inStock: true,
  },
  {
    id: 4,
    name: 'Mechanical Keyboard Pro',
    price: 149,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400',
    inStock: true,
  },
  {
    id: 5,
    name: 'Noise-Cancelling Earbuds',
    price: 179,
    category: 'Audio',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400',
    inStock: true,
  },
  {
    id: 6,
    name: 'Portable SSD 1TB',
    price: 129,
    category: 'Storage',
    image:
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=400',
    inStock: false,
  },
];

// In-memory orders store
const orders = [];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// GET all products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
    return res.json(filtered);
  }
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST checkout
app.post('/api/checkout', (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' });
  }

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const order = {
    id: orders.length + 1,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  res.status(201).json({
    message: 'Order placed successfully',
    orderId: order.id,
    total,
  });
});

// Root
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
