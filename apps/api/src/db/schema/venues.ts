import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { geographyPoint } from '../geography';
import { timestamps } from './_shared';

/**
 * A physical location that hosts tournaments. start.gg gives no stable venue id
 * (address/lat/lng hang off the tournament), so venues have no sourceIdentity;
 * dedupe strategy (proximity + name) is TODO and lives in the ingestion layer.
 */
export const venues = pgTable(
  'venues',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    address: text('address'),
    location: geographyPoint('location').notNull(),
    ...timestamps,
  },
  (table) => [
    // GIST index makes ST_DWithin / ST_Distance radius queries index-assisted.
    index('venues_location_idx').using('gist', table.location),
  ],
);
