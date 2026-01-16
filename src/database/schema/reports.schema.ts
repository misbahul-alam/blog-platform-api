import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './schema';
import { relations } from 'drizzle-orm';

export const reportStatusEnum = pgEnum('report_status', [
  'pending',
  'resolved',
  'dismissed',
]);
export const reportTypeEnum = pgEnum('report_type', [
  'post',
  'comment',
  'user',
]);

export const reports = pgTable(
  'reports',
  {
    id: serial('id').primaryKey(),
    reporterId: integer('reporter_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    type: reportTypeEnum('type').notNull(),
    targetId: integer('target_id').notNull(),
    reason: text('reason').notNull(),
    status: reportStatusEnum('status').default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      reporterIndex: index('reports_reporter_id_index').on(table.reporterId),
      statusIndex: index('reports_status_index').on(table.status),
    };
  },
);

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
}));
