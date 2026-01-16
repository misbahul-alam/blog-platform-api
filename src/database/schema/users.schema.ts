import { relations } from 'drizzle-orm';
import {
  uniqueIndex,
  index,
  pgEnum,
  timestamp,
  boolean,
  pgTable,
  serial,
  varchar,
  text,
} from 'drizzle-orm/pg-core';
import { posts, comments, bookmarks, postLikes, commentLikes } from './schema';
export const roleEnum = pgEnum('role', ['admin', 'author', 'reader']);
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 30 }).notNull(),
    lastName: varchar('last_name', { length: 30 }).notNull(),
    email: varchar('email', { length: 200 }).notNull().unique(),
    role: roleEnum('role').default('reader').notNull(),
    avatar: varchar('avatar', { length: 200 }),
    bio: text('bio'),
    isVerified: boolean('is_verified').default(false).notNull(),
    verificationToken: varchar('verification_token', { length: 255 }),
    password: text('password').notNull(),
    resetPasswordToken: varchar('reset_password_token', { length: 255 }),
    resetPasswordExpires: timestamp('reset_password_expires'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex('users_email_index').on(table.email),
      roleIndex: index('users_role_index').on(table.role),
    };
  },
);

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  bookmarks: many(bookmarks),
  likedPosts: many(postLikes),
  likedComments: many(commentLikes),
}));
