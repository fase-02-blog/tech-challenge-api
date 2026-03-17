import { Router } from 'express';
import { PostController } from './postController';
import { PostService } from './postService';
import { NativeSqlPostRepository } from './nativeSqlPostRepository';

const postRouter = Router();

// Injeção de Dependência Manual (SQL Nativo / PostgreSQL)
const repository = new NativeSqlPostRepository();
const service = new PostService(repository);
const controller = new PostController(service);

postRouter.get('/', (req, res) => controller.list(req, res));
postRouter.get('/search', (req, res) => controller.search(req, res));
postRouter.get('/:id', (req, res) => controller.getById(req, res));
postRouter.post('/', (req, res) => controller.create(req, res));
postRouter.put('/:id', (req, res) => controller.update(req, res));
postRouter.delete('/:id', (req, res) => controller.delete(req, res));

export { postRouter };
