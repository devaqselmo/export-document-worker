import { type ExportMessage, exportMessageSchema } from "../schemas/message.js";

export function parseExportMessage(body: string): ExportMessage {
  return exportMessageSchema.parse(JSON.parse(body));
}
