CREATE TABLE `rooms` (
  `code` text PRIMARY KEY NOT NULL,
  `kind` text NOT NULL,
  `mode` text NOT NULL,
  `goal` integer NOT NULL,
  `language` text NOT NULL,
  `difficulty` text NOT NULL,
  `text` text NOT NULL,
  `status` text NOT NULL,
  `host_id` text NOT NULL,
  `guest_id` text,
  `host_name` text NOT NULL,
  `guest_name` text,
  `host_progress` integer NOT NULL DEFAULT 0,
  `guest_progress` integer NOT NULL DEFAULT 0,
  `host_errors` integer NOT NULL DEFAULT 0,
  `guest_errors` integer NOT NULL DEFAULT 0,
  `started_at` integer,
  `winner` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  `expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rooms_matchmaking_idx` ON `rooms` (`kind`, `status`, `language`, `mode`, `goal`, `difficulty`, `created_at`);
