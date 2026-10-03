import { envSchema } from "../schemas/env.js";

export const env = envSchema.parse(process.env);
