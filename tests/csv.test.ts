import { describe, expect, it } from "vitest";
import { generateCsv } from "../src/generators/csv.js";

describe("generateCsv", () => {
  it("writes a header row followed by one line per row", () => {
    const csv = generateCsv([
      { auctionId: 1, bids: 10 },
      { auctionId: 2, bids: 0 },
    ]);

    expect(csv).toBe("auctionId,bids\n1,10\n2,0\n");
  });

  it("quotes values containing commas", () => {
    const csv = generateCsv([{ title: "Vase, antique" }]);

    expect(csv).toBe('title\n"Vase, antique"\n');
  });
});
