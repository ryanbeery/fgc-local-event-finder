import { z } from 'zod';

/**
 * Defines and validates, with zod, the app's environment variables. Called from
 * two entry points that can't share Nest's DI container: Drizzle Kit's config
 * (a CLI) and the Nest ConfigModule at boot.
 */
const envSchema = z.object({
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_HOST: z.string().min(1).default('localhost'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
  // Optional override; when present it wins over the assembled parts.
  DATABASE_URL: z.string().url().optional(),
  // Personal access token to ingest start.gg data
  START_GG_PAT: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validator for @nestjs/config's `validate` hook. Runs the same schema against
 * the process environment at app boot, so a bad environment fails loudly on
 * startup rather than on the first query. Returns the parsed (coerced, defaulted)
 * values.
 */
export function validateEnv(config: Record<string, unknown>): Env {
  return envSchema.parse(config);
}

/**
 * Resolve the Postgres connection URL from the environment. Throws (via Zod) if
 * required parts are missing or malformed, so misconfiguration fails loudly.
 * In production, a full DATABASE_URL is injected and takes precedence.
 */
export function databaseUrl(source: NodeJS.ProcessEnv = process.env): string {
  const env = envSchema.parse(source);
  if (env.DATABASE_URL) return env.DATABASE_URL;

  // The password can contain URL-reserved characters (e.g. '%'), so encode it.
  const password = encodeURIComponent(env.POSTGRES_PASSWORD);
  return `postgres://${env.POSTGRES_USER}:${password}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
}
