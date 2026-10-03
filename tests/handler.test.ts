import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleExport } from "../src/handlers/export.js";

const {
  markExportFailed,
  markExportCompleted,
  interpretPrompt,
  run,
  uploadFile,
} = vi.hoisted(() => ({
  markExportFailed: vi.fn(),
  markExportCompleted: vi.fn(),
  interpretPrompt: vi.fn(),
  run: vi.fn(),
  uploadFile: vi.fn(),
}));

vi.mock("../src/db/exports.js", () => ({
  markExportFailed,
  markExportCompleted,
}));
vi.mock("../src/utils/interpret.js", () => ({ interpretPrompt }));
vi.mock("../src/utils/storage.js", () => ({ uploadFile }));

const message = {
  exportId: "7b0f6d1e-6f0a-4a43-9d57-2f5d0d7f3c11",
  requestedBy: "admin-1",
  prompt: "how many bids did auction 123 get",
  format: "csv",
};

const interpretation = {
  tool: { name: "getAuctionStats", run },
  params: { auctionCode: 123 },
};

describe("handleExport", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fails the export for an unsupported format without calling the LLM", async () => {
    await handleExport({ ...message, format: "docx" });

    expect(markExportFailed).toHaveBeenCalledWith(
      message.exportId,
      "Unsupported format: docx",
    );
    expect(interpretPrompt).not.toHaveBeenCalled();
  });

  it("fails the export when the prompt matches no tool", async () => {
    interpretPrompt.mockResolvedValue(undefined);

    await handleExport(message);

    expect(markExportFailed).toHaveBeenCalledWith(
      message.exportId,
      "Could not match the request to a report",
    );
    expect(run).not.toHaveBeenCalled();
  });

  it("marks the export failed with a generic reason when something throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    interpretPrompt.mockRejectedValue(new Error("OpenAI is down"));

    await handleExport(message);

    expect(markExportFailed).toHaveBeenCalledWith(
      message.exportId,
      "Unexpected error while exporting",
    );
  });

  it("fails the export when the tool returns no rows", async () => {
    interpretPrompt.mockResolvedValue(interpretation);
    run.mockResolvedValue([]);

    await handleExport(message);

    expect(markExportFailed).toHaveBeenCalledWith(
      message.exportId,
      "No data found for the request",
    );
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it("runs the tool with the interpreted params, uploads the CSV and completes the export", async () => {
    interpretPrompt.mockResolvedValue(interpretation);
    run.mockResolvedValue([
      { code: 123, title: "Cars", visits: 50, totalBids: 3 },
    ]);

    await handleExport(message);

    expect(run).toHaveBeenCalledWith({ auctionCode: 123 });
    expect(uploadFile).toHaveBeenCalledWith(
      `exports/${message.exportId}.csv`,
      "code,title,visits,totalBids\n123,Cars,50,3\n",
      "text/csv",
    );
    expect(markExportCompleted).toHaveBeenCalledWith(message.exportId, {
      tool: "getAuctionStats",
      params: { auctionCode: 123 },
      s3Key: `exports/${message.exportId}.csv`,
    });
    expect(markExportFailed).not.toHaveBeenCalled();
  });

  it.each([
    [
      "xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    ["pdf", "application/pdf"],
  ])("uploads a %s file with its content type", async (format, contentType) => {
    interpretPrompt.mockResolvedValue(interpretation);
    run.mockResolvedValue([{ code: 123, title: "Cars" }]);

    await handleExport({ ...message, format });

    expect(uploadFile).toHaveBeenCalledWith(
      `exports/${message.exportId}.${format}`,
      expect.any(Buffer),
      contentType,
    );
    expect(markExportCompleted).toHaveBeenCalled();
  });
});
