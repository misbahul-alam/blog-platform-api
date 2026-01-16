import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const newsletters = pgTable(
  'newsletters',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    isActive: boolean('is_active').default(true).notNull(),
    subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
    unsubscribedAt: timestamp('unsubscribed_at'),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex('newsletters_email_index').on(table.email),
    };
  },
);
