import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../utils/config.js";

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    statement_timeout: 30_000,
  },
});
