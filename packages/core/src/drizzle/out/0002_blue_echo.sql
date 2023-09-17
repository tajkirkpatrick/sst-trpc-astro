ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_keys" ADD COLUMN "createdAt" date NOT NULL;