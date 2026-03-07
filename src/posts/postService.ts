import { Post } from './post';
import { IPostRepository } from './postRepository';

export interface IICreatePostDTO {
  title: string;
  content: string;
  author: string;
}

export class PostService {
  constructor(private readonly postRepository: IPostRepository) {}

  async create(data: IICreatePostDTO): Promise<Post> {
    const post = Post.create(data.title, data.content, data.author);
    return this.postRepository.create(post);
  }

  async listAll(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async findById(id: string): Promise<Post | null> {
    return this.postRepository.findById(id);
  }

  async search(query: string): Promise<Post[]> {
    return this.postRepository.search(query);
  }

  async update(id: string, data: Partial<IICreatePostDTO>): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    
    post.update(data.title, data.content, data.author);
    return this.postRepository.update(post);
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
