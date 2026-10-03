import PDFDocument from "pdfkit";

export function generatePdf(rows: Record<string, unknown>[]) {
  return new Promise<Buffer>((resolve) => {
    const columns = Object.keys(rows[0] ?? {});
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.table({
      data: [
        columns.map((text) => ({ text, font: { family: "Helvetica-Bold" } })),
        ...rows.map((row) => columns.map((key) => String(row[key] ?? ""))),
      ],
    });
    doc.end();
  });
}
