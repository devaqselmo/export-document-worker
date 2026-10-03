import { describe, expect, it } from "vitest";
import { parseExportMessage } from "../src/utils/message.js";

const validMessage = {
  exportId: "7b0f6d1e-6f0a-4a43-9d57-2f5d0d7f3c11",
  requestedBy: "admin-1",
  prompt: "how many bids did auction 123 get last week",
  format: "csv",
};

describe("parseExportMessage", () => {
  it("parses a valid message body", () => {
    expect(parseExportMessage(JSON.stringify(validMessage))).toEqual(
      validMessage,
    );
  });

  it("keeps an unsupported format so it can be rejected later", () => {
    const body = JSON.stringify({ ...validMessage, format: "docx" });

    expect(parseExportMessage(body).format).toBe("docx");
  });

  it("rejects a message without prompt", () => {
    const { prompt: _prompt, ...withoutPrompt } = validMessage;

    expect(() => parseExportMessage(JSON.stringify(withoutPrompt))).toThrow();
  });

  it("rejects a non-uuid exportId", () => {
    const body = JSON.stringify({ ...validMessage, exportId: "123" });

    expect(() => parseExportMessage(body)).toThrow();
  });

  it("rejects a body that is not JSON", () => {
    expect(() => parseExportMessage("not json")).toThrow();
  });
});
