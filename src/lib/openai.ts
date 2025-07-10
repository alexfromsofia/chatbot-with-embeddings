import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

export async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  });
  return embedding;
}
