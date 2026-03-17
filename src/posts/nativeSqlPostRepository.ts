import { db } from '../lib/db';
import { Post } from './post';
import { IPostRepository } from './postRepository';
import { IPostPersistence, PostMapper } from './postMapper';

export class NativeSqlPostRepository implements IPostRepository {
  async create(post: Post): Promise<Post> {
    const raw = PostMapper.toPersistence(post);
    const query = `
      INSERT INTO "posts" (title, content, author, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [raw.title, raw.content, raw.author, raw.createdAt, raw.updatedAt];
    const { rows } = await db.query(query, values);
    return PostMapper.toDomain(rows[0] as IPostPersistence);
  }

  async findById(uuid: string): Promise<Post | null> {
    const query = 'SELECT * FROM "posts" WHERE uuid = $1;';
    const { rows } = await db.query(query, [uuid]);
    if (rows.length === 0) return null;
    return PostMapper.toDomain(rows[0] as IPostPersistence);
  }

  async findAll(): Promise<Post[]> {
    const query = 'SELECT * FROM "posts" ORDER BY "createdAt" DESC;';
    const { rows } = await db.query(query);
    return rows.map((row: IPostPersistence) => PostMapper.toDomain(row));
  }

  async update(post: Post): Promise<Post> {
    if (!post.uuid) throw new Error('Post UUID is required for update');
    const query = `
      UPDATE "posts"
      SET title = $1, content = $2, author = $3, "updatedAt" = $4
      WHERE uuid = $5
      RETURNING *;
    `;
    const values = [post.title, post.content, post.author, post.updatedAt, post.uuid];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) throw new Error('Post not found');
    return PostMapper.toDomain(rows[0] as IPostPersistence);
  }

  async delete(uuid: string): Promise<void> {
    const query = 'DELETE FROM "posts" WHERE uuid = $1;';
    await db.query(query, [uuid]);
  }

  async search(queryText: string): Promise<Post[]> {
    const query = `
      SELECT * FROM "posts"
      WHERE title ILIKE $1 OR content ILIKE $1
      ORDER BY "createdAt" DESC;
    `;
    const { rows } = await db.query(query, [`%${queryText}%`]);
    return rows.map((row: IPostPersistence) => PostMapper.toDomain(row));
  }
}
