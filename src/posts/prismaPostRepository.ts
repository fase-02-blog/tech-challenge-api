import { IPostPersistence, PostMapper } from './postMapper';
import { Post } from './post';
import { IPostRepository } from './postRepository';
import { prisma } from '@/lib/prisma';

export class PrismaPostRepository implements IPostRepository {
  async create(post: Post): Promise<Post> {
    const raw = PostMapper.toPersistence(post);
    const created = await prisma.post.create({
      data: {
        title: raw.title,
        content: raw.content,
        author: raw.author,
      },
    });
    return PostMapper.toDomain(created as IPostPersistence);
  }

  async findById(id: string): Promise<Post | null> {
    const found = await prisma.post.findUnique({
      where: { id },
    });
    if (!found) return null;
    return PostMapper.toDomain(found as IPostPersistence);
  }

  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return posts.map((p) => PostMapper.toDomain(p as IPostPersistence));
  }

  async update(post: Post): Promise<Post> {
    if (!post.id) throw new Error('Post ID is required for update');
    const updated = await prisma.post.update({
      where: { id: post.id },
      data: {
        title: post.title,
        content: post.content,
        author: post.author,
      },
    });
    return PostMapper.toDomain(updated as IPostPersistence);
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }

  async search(query: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return posts.map((p) => PostMapper.toDomain(p as IPostPersistence));
  }
}
