import { customType } from 'drizzle-orm/pg-core';

/** A WGS84 (SRID 4326) longitude/latitude pair. */
export type LngLat = { lng: number; lat: number };

/**
 * A PostGIS `geography(Point, 4326)` column. Drizzle has no native geography
 * type, so this is a thin shim.
 *
 * Direction matters:
 *  - WRITE is clean: an { lng, lat } object becomes WKT that PostGIS accepts.
 *  - READ is not: selecting the raw column returns EWKB hex, which we don't
 *    want to parse here. Instead, never select the column raw — project it in
 *    the query with ST_X/ST_Y (or ST_AsGeoJSON). fromDriver is left as a
 *    tripwire so an accidental raw select fails loudly instead of silently
 *    returning garbage.
 *
 * geography (not geometry) is deliberate: distance/radius math is spheroidal
 * and in meters, so "venues within N meters" is correct without projection.
 */
export const geographyPoint = customType<{
  data: LngLat;
  driverData: string;
}>({
  dataType() {
    return 'geography(Point, 4326)';
  },
  toDriver(value: LngLat): string {
    return `SRID=4326;POINT(${value.lng} ${value.lat})`;
  },
  fromDriver(): LngLat {
    throw new Error(
      'Do not select a geography column raw; project it with ST_X/ST_Y or ST_AsGeoJSON.',
    );
  },
});
