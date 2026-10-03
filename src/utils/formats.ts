import { type ExportFormat, exportFormatSchema } from "../schemas/format.js";

export function isSupportedFormat(format: string): format is ExportFormat {
  return exportFormatSchema.safeParse(format).success;
}
