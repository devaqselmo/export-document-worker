import ExcelJS from "exceljs";

export async function generateXlsx(rows: Record<string, unknown>[]) {
  const columns = Object.keys(rows[0] ?? {});
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Export");
  sheet.columns = columns.map((key) => ({ header: key, key }));
  sheet.addRows(rows);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
