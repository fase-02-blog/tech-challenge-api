import request from 'supertest';
import app from '@/app';
import { db } from '@/lib/db';

describe('Post API Resilience', () => {
  describe('Invalid UUIDs', () => {
    it('should return 500 for malformed UUID in GET', async () => {
      const response = await request(app).get('/posts/not-a-uuid-123');
      // The application currently returns 500 for unhandled DB errors from controller
      expect(response.status).toBe(500);
    });

    it('should return 500 for malformed UUID in DELETE', async () => {
      const response = await request(app).delete('/posts/not-a-uuid-123');
      expect(response.status).toBe(500);
    });
  });

  describe('Database Downtime Simulation', () => {
    it('should return 500 when database is unreachable', async () => {
      // Mock db.query as the app uses NativeSqlPostRepository by default in routes
      const originalQuery = db.query;
      db.query = jest.fn().mockRejectedValue(new Error('Connection refused'));

      const response = await request(app).get('/posts');
      
      // Erros de infraestrutura (banco indisponível) devem retornar 500
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Connection refused');

      // Restore
      db.query = originalQuery;
    });
  });
});
