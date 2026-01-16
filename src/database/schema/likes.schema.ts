import {
  pgTable,
  primaryKey,
  integer,
  index,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users, posts, comments } from './schema';
import { relations } from 'drizzle-orm';

export const postLikes = pgTable(
  'post_likes',
  {
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
      pk: primaryKey({ columns: [table.userId, table.postId] }),
      postIndex: index('post_likes_post_id_index').on(table.postId),
    };
  },
);

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
}));

export const commentLikes = pgTable(
  'comment_likes',
  {
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: integer('comment_id')
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.commentId] }),
      commentIndex: index('comment_likes_comment_id_index').on(table.commentId),
    };
  },
);

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
}));
