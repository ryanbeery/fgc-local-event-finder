import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './_shared';

/**
 * A game title (SF6, Tekken 8, ...). Small lookup table keyed on start.gg's
 * stable videogame id so events reference a canonical row instead of a free-text
 * name that would drift ("SF6" vs "Street Fighter 6"). Nullable id leaves room
 * for a manually-added game with no start.gg mapping.
 */
export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  startggVideogameId: integer('startgg_videogame_id').unique(),
  ...timestamps,
});
