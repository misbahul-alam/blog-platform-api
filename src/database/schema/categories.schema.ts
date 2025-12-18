import { posts } from './schema';
import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    parentId: integer('parent_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      slugIndex: uniqueIndex('categories_slug_index').on(table.slug),
      parentIndex: index('categories_parent_id_index').on(table.parentId),
    };
  },
);

export const categoryRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  posts: many(posts),
}));
