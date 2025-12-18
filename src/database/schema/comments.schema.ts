import {
  pgTable,
  serial,
  index,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { posts, users } from './schema';
import { relations } from 'drizzle-orm';

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      postIndex: index('comments_post_id_index').on(table.postId),
      userIndex: index('comments_user_id_index').on(table.userId),
    };
  },
);

export const commentRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
