import { z } from "zod";

// Format stays a free string: unsupported formats are rejected later with a failed export record.
export const exportMessageSchema = z.object({
  exportId: z.uuid(),
  requestedBy: z.string().min(1),
  prompt: z.string().min(1),
  format: z.string().min(1),
});

export type ExportMessage = z.infer<typeof exportMessageSchema>;
