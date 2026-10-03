import { defineConfig } from "drizzle-kit";

// Used only to introspect the existing database: `pnpm drizzle-kit pull`.
export default defineConfig({
  dialect: "postgresql",
  out: "./.drizzle",
  dbCredentials: { url: process.env.DATABASE_URL as string },
});
