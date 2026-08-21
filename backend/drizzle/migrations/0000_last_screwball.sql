CREATE TABLE `habit_logs` (
	`habit_id` text NOT NULL,
	`date` text NOT NULL,
	PRIMARY KEY(`habit_id`, `date`),
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`frequency` text NOT NULL,
	`daily_target` integer NOT NULL,
	`unit` text,
	`created_at` text NOT NULL
);
