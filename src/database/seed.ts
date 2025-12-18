import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import * as schema from './schema/schema';
import 'dotenv/config';
import { DrizzleDB } from './types/drizzle';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

console.log('URL' + process.env.DATABASE_URL!);
const db = drizzle(pool, { schema }) as DrizzleDB;

async function main() {
  console.log('🚀 Starting seed...');

  const usersToInsert = Array.from({ length: 50 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'hashed_password_example',
    role: faker.helpers.arrayElement(['admin', 'author', 'user'] as const),
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    isVerified: true,
  }));
  const insertedUsers = (await db
    .insert(schema.users)
    .values(usersToInsert)
    .returning()) as any[];

  const categoriesToInsert = Array.from({ length: 20 }).map(() => {
    const name = faker.commerce.department();
    return {
      name,
      slug:
        faker.helpers.slugify(name).toLowerCase() +
        '-' +
        faker.string.nanoid(4),
    };
  });
  const insertedCategories = (await db
    .insert(schema.categories)
    .values(categoriesToInsert)
    .returning()) as any[];

  const tagsToInsert = [
    'React',
    'Node',
    'TypeScript',
    'Drizzle',
    'Postgres',
  ].map((name) => ({ name }));
  const insertedTags = (await db
    .insert(schema.tags)
    .values(tagsToInsert)
    .returning()) as any[];

  const postsToInsert = Array.from({ length: 100 }).map(() => {
    const title = faker.lorem.sentence();
    return {
      title,
      slug:
        faker.helpers.slugify(title).toLowerCase() +
        '-' +
        faker.string.nanoid(6),
      image: `https://picsum.photos/seed/${faker.string.uuid()}/800/600`,
      content: faker.lorem.paragraphs(4),
      excerpt: faker.lorem.sentence().substring(0, 255),
      authorId: faker.helpers.arrayElement(insertedUsers).id,
      categoryId: faker.helpers.arrayElement(insertedCategories).id,
      status: faker.helpers.arrayElement([
        'draft',
        'published',
        'archived',
      ] as const),
      views: faker.number.int({ min: 0, max: 10000 }),
      publishedAt: new Date(),
    };
  });
  const insertedPosts = (await db
    .insert(schema.posts)
    .values(postsToInsert)
    .returning()) as any[];

  const postTagData = insertedPosts.flatMap((post) => {
    const randomTags = faker.helpers.arrayElements(insertedTags, {
      min: 1,
      max: 2,
    });
    return randomTags.map((tag) => ({
      postId: post.id,
      tagId: tag.id,
    }));
  });
  await db.insert(schema.postTags).values(postTagData);

  const commentData = Array.from({ length: 150 }).map(() => ({
    postId: faker.helpers.arrayElement(insertedPosts).id,
    userId: faker.helpers.arrayElement(insertedUsers).id,
    content: faker.lorem.paragraph(),
  }));
  await db.insert(schema.comments).values(commentData);

  const bookmarkData = Array.from({ length: 80 }).map(() => ({
    postId: faker.helpers.arrayElement(insertedPosts).id,
    userId: faker.helpers.arrayElement(insertedUsers).id,
  }));

  await db.insert(schema.bookmarks).values(bookmarkData).onConflictDoNothing();

  console.log('✅ Seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
