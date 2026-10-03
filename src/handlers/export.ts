import { markExportCompleted, markExportFailed } from "../db/exports.js";
import { generators } from "../generators/index.js";
import type { ExportMessage } from "../schemas/message.js";
import { isSupportedFormat } from "../utils/formats.js";
import { interpretPrompt } from "../utils/interpret.js";
import { uploadFile } from "../utils/storage.js";

export async function handleExport(message: ExportMessage) {
  try {
    await exportDocument(message);
  } catch (error) {
    console.error("export failed", message.exportId, error);
    await markExportFailed(
      message.exportId,
      "Unexpected error while exporting",
    );
  }
}

async function exportDocument(message: ExportMessage) {
  const { exportId, format, prompt } = message;

  if (!isSupportedFormat(format)) {
    await markExportFailed(exportId, `Unsupported format: ${format}`);
    return;
  }

  const interpretation = await interpretPrompt(prompt);
  if (!interpretation) {
    await markExportFailed(exportId, "Could not match the request to a report");
    return;
  }

  const { tool, params } = interpretation;
  const rows = await tool.run(params);
  if (rows.length === 0) {
    await markExportFailed(exportId, "No data found for the request");
    return;
  }

  const { generate, contentType } = generators[format];
  const s3Key = `exports/${exportId}.${format}`;
  await uploadFile(s3Key, await generate(rows), contentType);
  await markExportCompleted(exportId, { tool: tool.name, params, s3Key });
}
