# packages/

Shared libraries imported by the apps (never deployed on their own). Each
subfolder is its own pnpm workspace with its own `package.json`.

- `shared/` — TypeScript types, Zod schemas, game constants, source/status
  enums used by both `apps/api` and `apps/web`.

These are created in later steps.
