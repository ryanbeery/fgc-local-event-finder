// Post-processes freshly generated Drizzle migrations to fix PostGIS geography
// columns. drizzle-kit doesn't understand the geography type, so it renders our
// customType's `geography(Point, 4326)` as a quoted identifier —
// `"geography(Point, 4326)"` — which Postgres reads as a (nonexistent) type
// literally named that, and rejects. The parentheses are what trip it up.
//
// This unquotes any `"geography(...)"` back to a bare `geography(...)` and
// collapses the typmod whitespace to match how PostGIS reports the type
// (`geography(Point,4326)`), keeping future diffs quiet. It's idempotent —
// already-correct files are left untouched — and runs automatically as part of
// `pnpm db:generate`. See the customType shim in src/db/geography.ts.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const migrationsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'drizzle',
);

// "geography(Point, 4326)" -> geography(Point,4326)
const quotedGeography = /"(geography\s*\([^"]*\))"/gi;
const normalizeTypmod = (match) => match.replace(/\s+/g, '');

let changedFiles = 0;

for (const file of readdirSync(migrationsDir)) {
  if (!file.endsWith('.sql')) continue;

  const path = join(migrationsDir, file);
  const original = readFileSync(path, 'utf8');
  const fixed = original.replace(quotedGeography, (_, type) =>
    normalizeTypmod(type),
  );

  if (fixed !== original) {
    writeFileSync(path, fixed);
    changedFiles += 1;
    console.log(`fix-geography-ddl: unquoted geography type in ${file}`);
  }
}

if (changedFiles === 0) {
  console.log('fix-geography-ddl: no geography columns to fix');
}
