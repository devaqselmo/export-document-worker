import { stringify } from "csv-stringify/sync";

export function generateCsv(rows: Record<string, unknown>[]) {
  return stringify(rows, { header: true });
}
