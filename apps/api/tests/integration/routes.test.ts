import request from 'supertest';
import app from '../../src/app';

describe('API Routes Integration Tests', () => {
  it('should respond with a 200 status for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  // Add more integration tests for other routes as needed
});