ALTER TABLE "auth_keys" ALTER COLUMN "user_id" SET DATA TYPE varchar(26);--> statement-breakpoint
ALTER TABLE "auth_sessions" ALTER COLUMN "user_id" SET DATA TYPE varchar(26);