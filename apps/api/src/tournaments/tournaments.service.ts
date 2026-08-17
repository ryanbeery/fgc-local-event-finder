import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { DATABASE, type Database } from '../db/database.module';
import { tournaments } from '../db/schema';

@Injectable()
export class TournamentsService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** All tournaments, soonest first. Empty until ingestion runs. */
  findAll() {
    return this.db.select().from(tournaments).orderBy(asc(tournaments.startAt));
  }
}
