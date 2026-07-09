# apps/

Deployable applications in the monorepo. Each subfolder is its own pnpm
workspace with its own `package.json`.

- `api/` — NestJS backend: REST API, start.gg ingestion service, PgBoss worker
- `web/` — Expo frontend (React Native Web): list, map, and calendar views

These are created by their scaffolding tools in later steps.
