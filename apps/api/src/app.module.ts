import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env';
import { DatabaseModule } from './database/database.module';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [
    // Loads the repo-root .env and validates it (via the shared Zod schema)
    // at boot, so a bad environment fails loudly. Global: no re-importing.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    TournamentsModule,
  ],
})
export class AppModule {}
