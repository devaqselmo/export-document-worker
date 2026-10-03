import { z } from "zod";

export const exportFormatSchema = z.enum(["csv", "xlsx", "pdf"]);

export type ExportFormat = z.infer<typeof exportFormatSchema>;
