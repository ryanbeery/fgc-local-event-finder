import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import { databaseUrl } from '../config/env';
import * as schema from '../db/schema';

/** DI token for the Drizzle instance. Inject with `@Inject(DATABASE)`. */
export const DATABASE = Symbol('DATABASE');
/** Type of the injected connection, schema-aware for the query API. */
export type Database = PostgresJsDatabase<typeof schema>;

// Separate token for the underlying postgres.js client so we can close it on
// shutdown. Feature code injects DATABASE and never touches this directly.
const PG_CLIENT = Symbol('PG_CLIENT');

/**
 * Opens a single Postgres connection (the DI singleton) and exposes a Drizzle
 * instance app-wide. Global so any feature module can inject DATABASE without
 * re-importing. The connection URL comes from the shared databaseUrl().
 */
@Global()
@Module({
  providers: [
    {
      provide: PG_CLIENT,
      useFactory: (): Sql => postgres(databaseUrl()),
    },
    {
      provide: DATABASE,
      inject: [PG_CLIENT],
      useFactory: (client: Sql): Database => drizzle(client, { schema }),
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(PG_CLIENT) private readonly client: Sql) {}

  // Close the pool on shutdown so the process (and tests) exit cleanly.
  async onModuleDestroy(): Promise<void> {
    await this.client.end();
  }
}
