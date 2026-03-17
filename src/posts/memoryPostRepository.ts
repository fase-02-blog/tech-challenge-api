import { Post } from './post';
import { IPostRepository } from './postRepository';
import { PostMapper, IPostPersistence } from './postMapper';
import { v4 as uuidv4 } from 'uuid';

export class MemoryPostRepository implements IPostRepository {
  private posts: IPostPersistence[] = [];

  async create(post: Post): Promise<Post> {
    const raw = PostMapper.toPersistence(post);
    raw.id = this.posts.length + 1;
    raw.uuid = uuidv4();
    this.posts.push(raw);
    return PostMapper.toDomain(raw);
  }

  async findById(uuid: string): Promise<Post | null> {
    const raw = this.posts.find((p) => p.uuid === uuid);
    return raw ? PostMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<Post[]> {
    return this.posts.map(PostMapper.toDomain);
  }

  async update(post: Post): Promise<Post> {
    const index = this.posts.findIndex((p) => p.uuid === post.uuid);
    if (index === -1) throw new Error('Post not found');
    this.posts[index] = PostMapper.toPersistence(post);
    return post;
  }

  async delete(uuid: string): Promise<void> {
    this.posts = this.posts.filter((p) => p.uuid !== uuid);
  }

  async search(query: string): Promise<Post[]> {
    const filtered = this.posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase()),
    );
    return filtered.map(PostMapper.toDomain);
  }
}
