import type { z } from "zod";

export type Tool<S extends z.ZodType = z.ZodType> = {
  name: string;
  description: string;
  parameters: S;
  run(params: z.infer<S>): Promise<Record<string, unknown>[]>;
};
