import { Post } from './post';

export interface IPostPersistence {
  id: string | null;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PostMapper {
  static toDomain(raw: IPostPersistence): Post {
    return new Post(
      raw.id,
      raw.title,
      raw.content,
      raw.author,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
    );
  }

  static toPersistence(post: Post): IPostPersistence {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
