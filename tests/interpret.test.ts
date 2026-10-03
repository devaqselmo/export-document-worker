import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { interpretPrompt } from "../src/utils/interpret.js";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("openai", () => ({
  default: class {
    chat = { completions: { create } };
  },
}));
vi.mock("../src/utils/config.js", () => ({
  env: { OPENAI_API_KEY: "key", OPENAI_MODEL: "model" },
}));
vi.mock("../src/tools/index.js", () => ({
  tools: [
    {
      name: "getAuctionStats",
      description: "stats",
      parameters: z.object({ auctionCode: z.number().int() }),
    },
  ],
}));

const toolCall = (name: string, args: string) => ({
  choices: [
    {
      message: {
        tool_calls: [{ type: "function", function: { name, arguments: args } }],
      },
    },
  ],
});

describe("interpretPrompt", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("returns the chosen tool with its validated params", async () => {
    create.mockResolvedValue(
      toolCall("getAuctionStats", '{"auctionCode":123}'),
    );

    const result = await interpretPrompt("stats of auction 123");

    expect(result?.tool.name).toBe("getAuctionStats");
    expect(result?.params).toEqual({ auctionCode: 123 });
  });

  it("returns undefined when the model calls no tool", async () => {
    create.mockResolvedValue({ choices: [{ message: { content: "sorry" } }] });

    expect(await interpretPrompt("tell me a joke")).toBeUndefined();
  });

  it("returns undefined when the model calls an unknown tool", async () => {
    create.mockResolvedValue(toolCall("dropTables", "{}"));

    expect(await interpretPrompt("anything")).toBeUndefined();
  });

  it("returns undefined when the arguments do not match the tool schema", async () => {
    create.mockResolvedValue(
      toolCall("getAuctionStats", '{"auctionCode":"abc"}'),
    );

    expect(await interpretPrompt("stats of auction abc")).toBeUndefined();
  });
});
