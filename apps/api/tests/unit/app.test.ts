import request from 'supertest';
import app from '../../src/app';

describe('API Application', () => {
  it('should respond with a 200 status code on the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return a JSON response', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });
});