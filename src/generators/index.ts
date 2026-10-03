import type { ExportFormat } from "../schemas/format.js";
import { generateCsv } from "./csv.js";
import { generatePdf } from "./pdf.js";
import { generateXlsx } from "./xlsx.js";

type Rows = Record<string, unknown>[];

export const generators: Record<
  ExportFormat,
  {
    generate: (rows: Rows) => string | Buffer | Promise<Buffer>;
    contentType: string;
  }
> = {
  csv: { generate: generateCsv, contentType: "text/csv" },
  xlsx: {
    generate: generateXlsx,
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  pdf: { generate: generatePdf, contentType: "application/pdf" },
};
