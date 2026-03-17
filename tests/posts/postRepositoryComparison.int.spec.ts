import { PrismaPostRepository } from '@/posts/prismaPostRepository';
import { NativeSqlPostRepository } from '@/posts/nativeSqlPostRepository';
import { Post } from '@/posts/post';
import { prisma } from '@/lib/prisma';
import { db } from '@/lib/db';

describe('Repository Comparison (Prisma vs Native SQL)', () => {
  let prismaRepo: PrismaPostRepository;
  let nativeSqlRepo: NativeSqlPostRepository;
  const testPostsUuids: string[] = [];

  beforeAll(() => {
    prismaRepo = new PrismaPostRepository();
    nativeSqlRepo = new NativeSqlPostRepository();
  });

  afterEach(async () => {
    // Cleanup any posts created during tests
    for (const uuid of testPostsUuids) {
      await prisma.post.deleteMany({ where: { id: uuid } });
    }
    testPostsUuids.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await db.end();
  });

  async function createTestPost(title: string, content: string, author: string): Promise<Post> {
    const post = Post.create(title, content, author);
    const created = await prismaRepo.create(post);
    if (created.uuid) testPostsUuids.push(created.uuid);
    return created;
  }

  it('should return identical results for findAll', async () => {
    await createTestPost('Repo Compare 1', 'Content 1', 'Author 1');
    await createTestPost('Repo Compare 2', 'Content 2', 'Author 2');

    const prismaResults = await prismaRepo.findAll();
    const nativeResults = await nativeSqlRepo.findAll();

    // Sort to ensure comparison works regardless of order
    const sortFn = (a: Post, b: Post) => (a.uuid || '').localeCompare(b.uuid || '');
    prismaResults.sort(sortFn);
    nativeResults.sort(sortFn);

    expect(prismaResults.length).toBeGreaterThanOrEqual(2);
    expect(nativeResults.length).toBe(prismaResults.length);

    for (let i = 0; i < prismaResults.length; i++) {
      expect(nativeResults[i].uuid).toBe(prismaResults[i].uuid);
      expect(nativeResults[i].title).toBe(prismaResults[i].title);
      expect(nativeResults[i].content).toBe(prismaResults[i].content);
      expect(nativeResults[i].author).toBe(prismaResults[i].author);
    }
  });

  it('should return identical results for findById', async () => {
    const created = await createTestPost('Single Post', 'Content', 'Author');
    const uuid = created.uuid!;

    const prismaResult = await prismaRepo.findById(uuid);
    const nativeResult = await nativeSqlRepo.findById(uuid);

    expect(prismaResult).not.toBeNull();
    expect(nativeResult).not.toBeNull();
    expect(nativeResult?.uuid).toBe(prismaResult?.uuid);
    expect(nativeResult?.title).toBe(prismaResult?.title);
  });

  it('should return identical results for search', async () => {
    const uniqueTerm = `UniqueTerm_${Date.now()}`;
    await createTestPost(`Title ${uniqueTerm}`, 'Content', 'Author');
    await createTestPost('Other Title', `Content ${uniqueTerm}`, 'Author');

    const prismaResults = await prismaRepo.search(uniqueTerm);
    const nativeResults = await nativeSqlRepo.search(uniqueTerm);

    expect(prismaResults.length).toBe(2);
    expect(nativeResults.length).toBe(2);
    
    const prismaUuids = prismaResults.map(p => p.uuid).sort();
    const nativeUuids = nativeResults.map(p => p.uuid).sort();
    
    expect(nativeUuids).toEqual(prismaUuids);
  });
});
