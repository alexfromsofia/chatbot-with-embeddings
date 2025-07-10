import { NextRequest, NextResponse } from "next/server";
import { VectorStore } from "@/lib/vector";

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case "search":
        const { queryEmbedding, limit, threshold } = data;
        const results = await VectorStore.similaritySearch(
          queryEmbedding,
          limit || 5,
          threshold || 0.7
        );
        return NextResponse.json({ success: true, data: results });

      case "create-session":
        const { title } = data;
        const session = await VectorStore.createChatSession(title);
        return NextResponse.json({ success: true, data: session });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Vector API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
