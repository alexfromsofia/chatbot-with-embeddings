import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "5");
    const category = searchParams.get("category");
    const metalType = searchParams.get("metalType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Build the search query using PostgreSQL full-text search
    let whereClause = `
      WHERE (
        to_tsvector('english', p.name || ' ' || p.description) @@ plainto_tsquery('english', $1)
        OR p.name ILIKE $2
        OR p.description ILIKE $2
      )
    `;

    const params: (string | number)[] = [query, `%${query}%`];
    let paramIndex = 3;

    // Add category filter
    if (category) {
      whereClause += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Add metal type filter
    if (metalType) {
      whereClause += ` AND p."metalType" = $${paramIndex}`;
      params.push(metalType);
      paramIndex++;
    }

    // Add price range filters
    if (minPrice) {
      whereClause += ` AND p.price >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereClause += ` AND p.price <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Add stock filter
    whereClause += ` AND p."stockCount" > 0`;

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
        ts_rank(to_tsvector('english', p.name || ' ' || p.description), plainto_tsquery('english', $1)) as relevance_score
      FROM products p
      ${whereClause}
      ORDER BY relevance_score DESC, p.price ASC
      LIMIT $${paramIndex}
    `;

    params.push(limit);

    const results = await prisma.$queryRawUnsafe(sql, ...params);

    return NextResponse.json({
      query,
      results,
      filters: {
        category,
        metalType,
        minPrice,
        maxPrice,
      },
      total: results.length,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, filters = {} } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Similar search logic as GET but with POST body
    let whereClause = `
      WHERE (
        to_tsvector('english', p.name || ' ' || p.description) @@ plainto_tsquery('english', $1)
        OR p.name ILIKE $2
        OR p.description ILIKE $2
      )
    `;

    const params: (string | number)[] = [query, `%${query}%`];
    let paramIndex = 3;

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

    whereClause += ` AND p."stockCount" > 0`;

    const limit = filters.limit || 5;
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
        ts_rank(to_tsvector('english', p.name || ' ' || p.description), plainto_tsquery('english', $1)) as relevance_score
      FROM products p
      ${whereClause}
      ORDER BY relevance_score DESC, p.price ASC
      LIMIT $${paramIndex}
    `;

    params.push(limit);

    const results = await prisma.$queryRawUnsafe(sql, ...params);

    return NextResponse.json({
      query,
      results,
      filters,
      total: results.length,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
