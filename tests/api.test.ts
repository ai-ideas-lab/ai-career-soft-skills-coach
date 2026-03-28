import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('API Endpoints', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/non-existent')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Route not found');
  });
});