const request = require('supertest');
const express = require('express');

// Setting up a simple mock server for testing
const app = express();
app.use(express.json());

// Dummy DB object for integration simulation
const db = {
  query: jest.fn().mockResolvedValue({ rowCount: 1 })
};

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/checkout', async (req, res) => {
  try {
    // Integrating DB logic into the API handler
    await db.query('INSERT INTO orders (id) VALUES ($1)', [req.body.id]);
    res.status(201).json({ message: 'Order created via DB integration' });
  } catch (err) {
    res.status(500).json({ error: 'DB failure' });
  }
});

describe('Backend API Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Unit Testing', () => {
    it('should return 200 OK from the basic health check endpoint safely', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Integration Testing', () => {
    it('should correctly integrate the API route with the simulated Database dependency', async () => {
      const response = await request(app).post('/api/checkout').send({ id: 101 });
      
      // Ensure the HTTP route successfully interacts with the backend logic
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Order created via DB integration');
      
      // Verify DB interaction explicitly
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('INSERT INTO orders (id) VALUES ($1)', [101]);
    });
  });
});
