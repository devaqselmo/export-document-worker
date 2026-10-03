import OpenAI from "openai";
import { z } from "zod";
import { tools } from "../tools/index.js";
import { env } from "./config.js";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const systemPrompt =
  "You map requests from an auction platform administrator to the available report tools. " +
  "Call a tool only when the request matches one; otherwise do not call any tool.";

// Returns undefined when the prompt matches no tool or the model's arguments are invalid.
export async function interpretPrompt(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    tools: tools.map(({ name, description, parameters }) => ({
      type: "function",
      function: { name, description, parameters: z.toJSONSchema(parameters) },
    })),
  });

  const call = completion.choices[0]?.message.tool_calls?.[0];
  if (call?.type !== "function") return undefined;

  const tool = tools.find((t) => t.name === call.function.name);
  const params = tool?.parameters.safeParse(
    JSON.parse(call.function.arguments),
  );
  if (!tool || !params?.success) return undefined;

  return { tool, params: params.data };
}
