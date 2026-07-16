import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sourceIdentity, timestamps } from './_shared';
import { games } from './games';
import { tournaments } from './tournaments';

/**
 * A single game's bracket within a tournament (start.gg "event"). Mirrors
 * start.gg's hierarchy so ingestion is near 1:1: each event belongs to one
 * tournament and (usually) one game, and carries its own schedule/entrant count.
 */
export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tournamentId: uuid('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    gameId: uuid('game_id').references(() => games.id),
    name: text('name').notNull(),
    startAt: timestamp('start_at', { withTimezone: true }),
    numEntrants: integer('num_entrants'),
    ...sourceIdentity,
    ...timestamps,
  },
  (table) => [
    uniqueIndex('events_source_idx').on(table.sourceType, table.externalId),
  ],
);
