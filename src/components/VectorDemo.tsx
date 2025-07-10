"use client";

import { useState } from "react";

export default function VectorDemo() {
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<
    Array<{
      id: string;
      text: string;
      similarity: number;
      metadata?: Record<string, unknown>;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const handleStoreEmbedding = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "store",
          data: {
            text: text.trim(),
            embedding: [], // Use empty array or remove if not needed
            metadata: { source: "demo", timestamp: new Date().toISOString() },
          },
        }),
      });

      if (response.ok) {
        setText("");
        alert("Embedding stored successfully!");
      } else {
        throw new Error("Failed to store embedding");
      }
    } catch (error) {
      console.error("Error storing embedding:", error);
      alert("Error storing embedding");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "search",
          data: {
            queryEmbedding: [], // Use empty array or remove if not needed
            limit: 5,
            threshold: 0.7,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.data || []);
      } else {
        throw new Error("Failed to search embeddings");
      }
    } catch (error) {
      console.error("Error searching embeddings:", error);
      alert("Error searching embeddings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Vector Database Demo
      </h1>

      {/* Store Embeddings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Store Embedding</h2>
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to store as embedding..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={handleStoreEmbedding}
            disabled={loading || !text.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Storing..." : "Store Embedding"}
          </button>
        </div>
      </div>

      {/* Search Embeddings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Search Embeddings</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={result.id}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    Result {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    Similarity: {(result.similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-gray-800">{result.text}</p>
                {result.metadata && (
                  <div className="mt-2 text-xs text-gray-600">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Store text with its vector embedding in PostgreSQL</li>
          <li>• Search for similar embeddings using cosine similarity</li>
          <li>• Results are ranked by similarity score</li>
          <li>
            • This demo uses mock embeddings - real apps use OpenAI&apos;s
            embedding API
          </li>
        </ul>
      </div>
    </div>
  );
}
