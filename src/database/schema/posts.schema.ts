import {
  pgTable,
  serial,
  text,
  varchar,
  pgEnum,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import {
  users,
  categories,
  comments,
  postTags,
  bookmarks,
  postLikes,
} from './schema';
import { relations } from 'drizzle-orm';

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 200 }).notNull().unique(),
    image: varchar('image', { length: 500 }).notNull(),
    content: text('content').notNull(),
    excerpt: varchar('excerpt', { length: 255 }),
    authorId: integer('author_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: integer('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    status: postStatusEnum('status').default('draft').notNull(),
    views: integer('views').default(0).notNull(),

    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => {
    return {
      slugIndex: uniqueIndex('posts_slug_index').on(table.slug),
      authorIndex: index('posts_author_id_index').on(table.authorId),
      statusIndex: index('posts_status_index').on(table.status),
      publishedAtIndex: index('posts_published_at_index').on(table.publishedAt),
    };
  },
);

export const postRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  tags: many(postTags),
  bookmarks: many(bookmarks),
  likes: many(postLikes),
}));
