import { prisma } from "./db";

export interface VectorSearchResult {
  id: string;
  text: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export class VectorStore {
  /**
   * Store text with its embedding
   */
  static async storeEmbedding(
    text: string,
    embedding: number[],
    metadata?: Record<string, unknown>
  ) {
    return await prisma.embedding.create({
      data: {
        text,
        embedding: embedding as unknown as number[], // Prisma will handle the vector type
        metadata,
      },
    });
  }

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
   * Store a message with its embedding
   */
  static async storeMessage(
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    embedding?: number[]
  ) {
    return await prisma.message.create({
      data: {
        role,
        content,
        sessionId,
        embedding: embedding as unknown as number[],
      },
    });
  }

  /**
   * Get chat history for a session
   */
  static async getChatHistory(sessionId: string) {
    return await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
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
