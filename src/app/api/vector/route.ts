import { NextRequest, NextResponse } from "next/server";
import { VectorStore } from "@/lib/vector";

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case "store":
        const { text, embedding, metadata } = data;
        const stored = await VectorStore.storeEmbedding(
          text,
          embedding,
          metadata
        );
        return NextResponse.json({ success: true, data: stored });

      case "search":
        const { queryEmbedding, limit, threshold } = data;
        const results = await VectorStore.similaritySearch(
          queryEmbedding,
          limit || 5,
          threshold || 0.7
        );
        return NextResponse.json({ success: true, data: results });

      case "store-message":
        const { sessionId, role, content, messageEmbedding } = data;
        const message = await VectorStore.storeMessage(
          sessionId,
          role,
          content,
          messageEmbedding
        );
        return NextResponse.json({ success: true, data: message });

      case "get-history":
        const { sessionId: historySessionId } = data;
        const history = await VectorStore.getChatHistory(historySessionId);
        return NextResponse.json({ success: true, data: history });

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const history = await VectorStore.getChatHistory(sessionId);
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Get history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
