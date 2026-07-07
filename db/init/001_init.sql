-- Runs once, on first container initialization (empty data volume).
-- Later schema changes should go through Drizzle Kit migrations, not here.

-- Enable PostGIS for geospatial venue/location queries.
CREATE EXTENSION IF NOT EXISTS postgis;

-- Sanity check that the extension is available.
DO $$
BEGIN
  RAISE NOTICE 'PostGIS version: %', postgis_full_version();
END
$$;
