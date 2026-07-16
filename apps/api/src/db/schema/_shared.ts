import { text, timestamp } from 'drizzle-orm/pg-core';

/** created_at / updated_at, timezone-aware, spread into any table. */
export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/**
 * Identity of an externally-sourced record. `externalId` is the source's stable
 * id; the (sourceType, externalId) pair is what we upsert on so re-syncing is
 * idempotent. Spread into any table that mirrors an external record.
 */
export const sourceIdentity = {
  sourceType: text('source_type').notNull().default('startgg'),
  externalId: text('external_id').notNull(),
  sourceUrl: text('source_url'),
};
