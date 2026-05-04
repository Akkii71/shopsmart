const request = require('supertest');
const app = require('../src/app');

describe('Backend API Tests', () => {
  describe('Health Check', () => {
    it('GET /api/health returns 200 with status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.message).toBe('ShopSmart Backend is running');
    });
  });

  describe('Products API', () => {
    it('GET /api/products returns all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /api/products?category=Audio filters by category', async () => {
      const res = await request(app).get('/api/products?category=Audio');
      expect(res.status).toBe(200);
      expect(res.body.every((p) => p.category === 'Audio')).toBe(true);
    });

    it('GET /api/products/:id returns the correct product', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(res.body.name).toBeDefined();
    });

    it('GET /api/products/:id returns 404 for unknown product', async () => {
      const res = await request(app).get('/api/products/9999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });

  describe('Checkout API', () => {
    it('POST /api/checkout places an order and returns orderId + total', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ items: [{ id: 1, quantity: 2 }] });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Order placed successfully');
      expect(res.body.orderId).toBeDefined();
      expect(res.body.total).toBe(598);
    });

    it('POST /api/checkout returns 400 for empty items array', async () => {
      const res = await request(app).post('/api/checkout').send({ items: [] });
      expect(res.status).toBe(400);
    });

    it('POST /api/checkout returns 400 when items field is missing', async () => {
      const res = await request(app).post('/api/checkout').send({});
      expect(res.status).toBe(400);
    });
  });
});
