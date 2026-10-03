import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { reportExport } from "./schema.js";

export async function markExportCompleted(
  id: string,
  data: { tool: string; params: unknown; s3Key: string },
) {
  await db
    .update(reportExport)
    .set({ ...data, status: "COMPLETED", completedAt: new Date() })
    .where(eq(reportExport.id, id));
}

export async function markExportFailed(id: string, error: string) {
  await db
    .update(reportExport)
    .set({ status: "FAILED", error, completedAt: new Date() })
    .where(eq(reportExport.id, id));
}
