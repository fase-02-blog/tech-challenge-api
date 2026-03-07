import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Post Resource Integration Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /posts', () => {
    describe('when data is valid (Happy Path)', () => {
      it('should create and return a new post', async () => {
        const payload = {
          title: 'Market Standard Test',
          content: 'Content',
          author: 'Author'
        };
        const response = await request(app).post('/posts').send(payload);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        
        await prisma.post.delete({ where: { id: response.body.id } });
      });
    });

    describe('when data is invalid (Edge Cases)', () => {
      // Aqui entrarão as validações da Sprint 6
    });
  });

  describe('GET /posts', () => {
    it('should return a list of posts', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return 200 and the post when ID exists', async () => {
      const post = await prisma.post.create({
        data: { title: 'Exist', content: 'C', author: 'A' }
      });
      const response = await request(app).get(`/posts/${post.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(post.id);
      
      await prisma.post.delete({ where: { id: post.id } });
    });

    it('should return 404 when ID does not exist', async () => {
      const response = await request(app).get('/posts/non-existent-id');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });
  });

  describe('GET /posts/search', () => {
    it('should return posts matching the query', async () => {
      const post = await prisma.post.create({
        data: { title: 'KeywordMatch', content: 'C', author: 'A' }
      });
      const response = await request(app).get('/posts/search?q=Keyword');
      
      expect(response.status).toBe(200);
      expect(response.body.some((p: any) => p.id === post.id)).toBe(true);
      
      await prisma.post.delete({ where: { id: post.id } });
    });

    it('should return empty list when no match is found', async () => {
      const response = await request(app).get('/posts/search?q=NOTHING_FOUND');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
