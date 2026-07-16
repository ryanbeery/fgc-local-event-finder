import { z } from 'zod';

/**
 * Single place that knows how the database connection string is built and
 * validated. Called from two entry points that can't share Nest's DI container:
 * Drizzle Kit's config (a CLI) and, later, the Nest ConfigModule at boot.
 *
 * Locally the POSTGRES_* parts are the source of truth and the URL is assembled
 * from them. In production a full DATABASE_URL is injected and takes precedence.
 */
const envSchema = z.object({
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_HOST: z.string().min(1).default('localhost'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
  // Optional override; when present it wins over the assembled parts.
  DATABASE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Resolve the Postgres connection URL from the environment. Throws (via Zod) if
 * required parts are missing or malformed, so misconfiguration fails loudly.
 */
export function databaseUrl(source: NodeJS.ProcessEnv = process.env): string {
  const env = envSchema.parse(source);
  if (env.DATABASE_URL) return env.DATABASE_URL;

  // The password can contain URL-reserved characters (e.g. '%'), so encode it.
  const password = encodeURIComponent(env.POSTGRES_PASSWORD);
  return `postgres://${env.POSTGRES_USER}:${password}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
}
