# FGC Local Tournament Finder

A lightweight, web-first platform that helps fighting game players answer:
**"When and where are tournaments near me?"**

The first version (POC) is intentionally constrained to **Houston** and powered by
**start.gg** data only. Events are ingested by the backend, normalized, and stored
in Postgres/PostGIS — the frontend reads from this app's database, never from
start.gg directly.

## Current status

Bootstrapping the **data layer**. First milestone: a local Postgres + PostGIS
database running via Docker Compose.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running)

## Local database

1. Copy the env template and adjust values if needed:

   ```bash
   cp .env.example .env
   ```

2. Start the database:

   ```bash
   docker compose up -d
   ```

   The `postgis/postgis` image is used (not vanilla `postgres`), and
   `db/init/001_init.sql` enables the PostGIS extension on first startup.

3. Verify it's healthy and PostGIS is enabled:

   ```bash
   docker compose ps
   docker compose exec db psql -U fgc -d fgc -c "SELECT postgis_version();"
   ```

4. Stop the database (data is preserved in the `db_data` volume):

   ```bash
   docker compose down
   ```

   To wipe the database entirely and re-run the init scripts:

   ```bash
   docker compose down -v
   ```

## Project layout

```
compose.yaml        Docker Compose services (Postgres/PostGIS)
.env.example        Committed env template
.env                Local env (git-ignored)
db/
  init/             SQL run once on first DB initialization
    001_init.sql    Enables the PostGIS extension
```

More packages (NestJS API, ingestion worker, shared schemas, Expo web) will be
added as the build progresses.
