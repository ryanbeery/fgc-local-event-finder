CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"location" geography(Point,4326) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"startgg_videogame_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "games_startgg_videogame_id_unique" UNIQUE("startgg_videogame_id")
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"start_at" timestamp with time zone,
	"end_at" timestamp with time zone,
	"venue_id" uuid,
	"source_type" text DEFAULT 'startgg' NOT NULL,
	"external_id" text NOT NULL,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"game_id" uuid,
	"name" text NOT NULL,
	"start_at" timestamp with time zone,
	"num_entrants" integer,
	"source_type" text DEFAULT 'startgg' NOT NULL,
	"external_id" text NOT NULL,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "venues_location_idx" ON "venues" USING gist ("location");--> statement-breakpoint
CREATE UNIQUE INDEX "tournaments_source_idx" ON "tournaments" USING btree ("source_type","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "events_source_idx" ON "events" USING btree ("source_type","external_id");