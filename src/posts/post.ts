export class Post {
  constructor(
    public readonly id: number | null,
    public readonly uuid: string | null,
    public title: string,
    public content: string,
    public author: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!this.content || this.content.trim() === '') {
      throw new Error('Content is required');
    }
    if (!this.author || this.author.trim() === '') {
      throw new Error('Author is required');
    }
  }

  static create(title: string, content: string, author: string): Post {
    const now = new Date();
    return new Post(null, null, title, content, author, now, now);
  }

  update(title?: string, content?: string, author?: string): void {
    if (title !== undefined) this.title = title;
    if (content !== undefined) this.content = content;
    if (author !== undefined) this.author = author;
    this.updatedAt = new Date();
    this.validate();
  }
}
