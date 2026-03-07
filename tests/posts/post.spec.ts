import { Post } from '@/posts/post';

describe('Post Entity', () => {
  it('should create a new post with valid data', () => {
    const post = Post.create('Test Title', 'Test Content', 'Test Author');
    expect(post.title).toBe('Test Title');
    expect(post.content).toBe('Test Content');
    expect(post.author).toBe('Test Author');
    expect(post.createdAt).toBeInstanceOf(Date);
  });

  it('should throw an error if title is empty', () => {
    expect(() => Post.create('', 'Content', 'Author')).toThrow('Title is required');
  });

  it('should throw an error if content is empty', () => {
    expect(() => Post.create('Title', '', 'Author')).toThrow('Content is required');
  });

  it('should throw an error if author is empty', () => {
    expect(() => Post.create('Title', 'Content', '')).toThrow('Author is required');
  });
});
