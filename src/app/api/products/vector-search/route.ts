import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { generateOpenAIEmbedding } from "../../../../lib/openai";

// Helper to convert embedding array to pgvector format
function embeddingToVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function POST(req: NextRequest) {
  try {
    const { query, filters = {}, limit = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Generate embedding for the query using OpenAI
    const queryEmbedding = await generateOpenAIEmbedding(query);
    const queryVector = embeddingToVector(queryEmbedding);

    // Build the search query using vector similarity
    let whereClause = `
      WHERE p.embedding IS NOT NULL AND p."stockCount" > 0
    `;

    const params: (string | number)[] = [queryVector];
    let paramIndex = 2;

    // Apply filters
    if (filters.category) {
      whereClause += ` AND p.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.metalType) {
      whereClause += ` AND p."metalType" = $${paramIndex}`;
      params.push(filters.metalType);
      paramIndex++;
    }

    if (filters.minPrice) {
      whereClause += ` AND p.price >= $${paramIndex}`;
      params.push(parseFloat(filters.minPrice));
      paramIndex++;
    }

    if (filters.maxPrice) {
      whereClause += ` AND p.price <= $${paramIndex}`;
      params.push(parseFloat(filters.maxPrice));
      paramIndex++;
    }

    whereClause += ` AND p."stockCount" > 0 AND p.embedding IS NOT NULL`;

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p."metalType",
        p.category,
        p.condition,
        p.weight,
        p."weightUnit",
        p.purity,
        p.price,
        p.currency,
        p.sku,
        p."stockCount",
        p.metadata,
        p.mint,
        p.grade,
        p."jewelryType",
        1 - (p.embedding <=> $1::vector) as similarity_score
      FROM products p
      ${whereClause}
      ORDER BY similarity_score DESC, p.price ASC
      LIMIT $${paramIndex}
    `;

    params.push(limit);

    const results = await prisma.$queryRawUnsafe(sql, ...params);

    return NextResponse.json({
      query,
      results,
      filters,
      total: results.length,
      searchType: "vector_similarity",
    });
  } catch (error) {
    console.error("Error in vector search:", error);
    return NextResponse.json(
      { error: "Failed to perform vector search" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Generate embedding for the query using OpenAI
    const queryEmbedding = await generateOpenAIEmbedding(query);
    const queryVector = embeddingToVector(queryEmbedding);

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p."metalType",
        p.category,
        p.condition,
        p.weight,
        p."weightUnit",
        p.purity,
        p.price,
        p.currency,
        p.sku,
        p."stockCount",
        p.metadata,
        p.mint,
        p.grade,
        p."jewelryType",
        1 - (p.embedding <=> $1::vector) as similarity_score
      FROM products p
      WHERE p.embedding IS NOT NULL AND p."stockCount" > 0
      ORDER BY similarity_score DESC, p.price ASC
      LIMIT $2
    `;

    const results = await prisma.$queryRawUnsafe(sql, queryVector, limit);

    return NextResponse.json({
      query,
      results,
      total: results.length,
      searchType: "vector_similarity",
    });
  } catch (error) {
    console.error("Error in vector search:", error);
    return NextResponse.json(
      { error: "Failed to perform vector search" },
      { status: 500 }
    );
  }
}
