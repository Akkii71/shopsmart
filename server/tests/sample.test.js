// sample.test.js
const request = require('supertest');
const express = require('express');

// Mock a helper utility
const { calculateDiscount } = require('../src/utils/helpers');
jest.mock('../src/utils/helpers', () => ({
  calculateDiscount: jest.fn()
}));

// Mock a controller
const { getUser } = require('../src/controllers/userController');
jest.mock('../src/controllers/userController', () => ({
  getUser: jest.fn()
}));

// Mock an async database function
const db = require('../src/config/db');
jest.mock('../src/config/db', () => ({
  query: jest.fn()
}));

// Setup mini Express app for supertest
const app = express();
app.use(express.json());
app.get('/api/users/:id', (req, res) => {
  getUser(req, res);
});

describe('Backend Sample Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Utility/Helper Function', () => {
    it('should call calculateDiscount mock', () => {
      calculateDiscount.mockReturnValue(50);
      const result = calculateDiscount(100, 50);
      
      expect(calculateDiscount).toHaveBeenCalledWith(100, 50);
      expect(result).toBe(50);
    });
  });

  describe('2. Controller or Route Handler Mocking', () => {
    it('should call the mocked getUser controller', () => {
      const req = { params: { id: '1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Make mocked controller send a response
      getUser.mockImplementation((req, res) => res.status(200).json({ id: '1', name: 'John Doe' }));

      getUser(req, res);
      
      expect(getUser).toHaveBeenCalledWith(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'John Doe' });
    });
  });

  describe('3. Async Function using async/await with mock resolved values', () => {
    it('should resolve the mocked db.query asynchronously', async () => {
      const mockUsers = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
      db.query.mockResolvedValue(mockUsers);

      const result = await db.query('SELECT * FROM users');
      
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users');
      expect(result).toEqual(mockUsers);
    });

    it('should handle rejected promises', async () => {
      db.query.mockRejectedValue(new Error('Database Connection Error'));

      await expect(db.query('SELECT * FROM users')).rejects.toThrow('Database Connection Error');
    });
  });

  describe('4. Supertest for HTTP Endpoint Testing', () => {
    it('should return 200 and mocked user data via GET /api/users/:id', async () => {
      getUser.mockImplementation((req, res) => res.status(200).json({ id: req.params.id, name: 'Endpoint Tester' }));

      const response = await request(app).get('/api/users/42');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '42', name: 'Endpoint Tester' });
      expect(getUser).toHaveBeenCalledTimes(1);
    });
    
    it('should correctly handle 404 responses', async () => {
      const response = await request(app).get('/api/non-existent-route');
      expect(response.status).toBe(404);
    });
  });
});
