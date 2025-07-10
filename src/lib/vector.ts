import { prisma } from "./db";

export interface VectorSearchResult {
  id: string;
  text: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export class VectorStore {
  /**
   * Search for similar embeddings using cosine similarity
   */
  static async similaritySearch(
    queryEmbedding: number[],
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<VectorSearchResult[]> {
    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        text: string;
        similarity: number;
        metadata: Record<string, unknown>;
      }>
    >`
      SELECT 
        id,
        text,
        metadata,
        1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM embeddings
      WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > ${threshold}
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT ${limit}
    `;

    return results.map(
      (result: {
        id: string;
        text: string;
        similarity: number;
        metadata: Record<string, unknown>;
      }) => ({
        id: result.id,
        text: result.text,
        similarity: result.similarity,
        metadata: result.metadata,
      })
    );
  }

  /**
   * Create a new chat session
   */
  static async createChatSession(title?: string) {
    return await prisma.chatSession.create({
      data: { title },
    });
  }
}
