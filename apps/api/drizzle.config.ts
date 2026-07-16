import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';
import { databaseUrl } from './src/config/env';

// Load the repo-root .env (the single source of truth, two levels up). Drizzle
// Kit doesn't auto-load env files, and Node's built-in loader avoids a dotenv
// dependency. The db:* scripts run from apps/api, so cwd is this package.
process.loadEnvFile(resolve(process.cwd(), '../../.env'));

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: { url: databaseUrl() },
  // PostGIS's own tables/types live in these schemas; keep Drizzle from trying
  // to manage or drop them.
  schemaFilter: ['public'],
  verbose: true,
  strict: true,
});
