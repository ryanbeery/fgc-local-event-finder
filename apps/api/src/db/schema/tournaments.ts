import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sourceIdentity, timestamps } from './_shared';
import { venues } from './venues';

/**
 * A tournament — the thing a person shows up to (start.gg "tournament"). Carries
 * the venue and the schedule; the individual game brackets are `events` that
 * point back here. Venue is nullable (address may be missing / online).
 */
export const tournaments = pgTable(
  'tournaments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    startAt: timestamp('start_at', { withTimezone: true }),
    endAt: timestamp('end_at', { withTimezone: true }),
    venueId: uuid('venue_id').references(() => venues.id),
    ...sourceIdentity,
    ...timestamps,
  },
  (table) => [
    // Upsert key: re-syncing the same tournament updates rather than duplicates.
    uniqueIndex('tournaments_source_idx').on(
      table.sourceType,
      table.externalId,
    ),
  ],
);
