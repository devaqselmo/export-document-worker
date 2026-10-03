import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { generatePdf } from "../src/generators/pdf.js";
import { generateXlsx } from "../src/generators/xlsx.js";

const rows = [
  { auctionId: 1, title: "Cars", bids: 10 },
  { auctionId: 2, title: "Boats", bids: 0 },
];

describe("generateXlsx", () => {
  it("writes a header row followed by one row per item", async () => {
    const workbook = new ExcelJS.Workbook();
    const file = (await generateXlsx(rows)) as unknown as ExcelJS.Buffer;
    await workbook.xlsx.load(file);
    const sheet = workbook.worksheets[0];

    expect(sheet?.getRow(1).values).toEqual([
      undefined,
      "auctionId",
      "title",
      "bids",
    ]);
    expect(sheet?.getRow(2).values).toEqual([undefined, 1, "Cars", 10]);
    expect(sheet?.getRow(3).values).toEqual([undefined, 2, "Boats", 0]);
  });
});

describe("generatePdf", () => {
  it("produces a PDF document", async () => {
    const pdf = await generatePdf(rows);

    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
