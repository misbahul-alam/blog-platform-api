import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { postTags } from './post_tags.schema';

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tagRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));
