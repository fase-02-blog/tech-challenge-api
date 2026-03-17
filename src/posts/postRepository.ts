import { Post } from './post';

export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(uuid: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  update(post: Post): Promise<Post>;
  delete(uuid: string): Promise<void>;
  search(query: string): Promise<Post[]>;
}
