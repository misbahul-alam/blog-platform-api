import {
  pgTable,
  serial,
  integer,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users, posts } from './schema';
import { relations } from 'drizzle-orm/relations';

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userPostUniqueIndex: uniqueIndex('bookmarks_user_post_unique_index').on(
        table.userId,
        table.postId,
      ),
    };
  },
);

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));
