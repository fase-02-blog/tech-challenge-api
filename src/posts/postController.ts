import { Request, Response } from 'express';
import { PostService } from './postService';

export class PostController {
  constructor(private readonly postService: PostService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const post = await this.postService.create(req.body);
      return res.status(201).json(post);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ message });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const posts = await this.postService.listAll();
    return res.status(200).json(posts);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const post = await this.postService.findById(id as string);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(post);
  }

  async search(req: Request, res: Response): Promise<Response> {
    const { q } = req.query;
    const posts = await this.postService.search(q as string);
    return res.status(200).json(posts);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const post = await this.postService.update(id as string, req.body);
      return res.status(200).json(post);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = message === 'Post not found' ? 404 : 400;
      return res.status(status).json({ message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.postService.delete(id as string);
    return res.status(204).send();
  }
}
