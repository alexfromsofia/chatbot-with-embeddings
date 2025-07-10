"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  metalType: string;
  category: string;
  condition: string;
  weight: number;
  weightUnit: string;
  purity: string;
  price: number;
  currency: string;
  sku: string;
  stockCount: number;
  similarity_score: number;
}

interface SearchResponse {
  query: string;
  results: Product[];
  total: number;
  searchType: string;
}

export default function VectorSearchDemo() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"text" | "vector">("vector");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const endpoint =
        searchType === "vector"
          ? "/api/products/vector-search"
          : "/api/products/search";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          limit: 10,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Search failed: ${errorText}`);
      }

      const data: SearchResponse = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vector Similarity Search Demo</h1>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About Vector Search</h2>
        <p className="text-sm text-gray-700">
          This demo shows vector similarity search using stored embeddings in
          pgvector. Each product has a 1536-dimensional embedding vector that
          captures semantic meaning. The search finds products with the most
          similar embeddings to your query.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products (e.g., 'gold coin', 'silver bar', 'platinum jewelry')"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="vector"
              checked={searchType === "vector"}
              onChange={(e) =>
                setSearchType(e.target.value as "text" | "vector")
              }
              className="mr-2"
            />
            Vector Similarity Search
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="text"
              checked={searchType === "text"}
              onChange={(e) =>
                setSearchType(e.target.value as "text" | "vector")
              }
              className="mr-2"
            />
            Text Search (for comparison)
          </label>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Results ({results.length} products found)
          </h3>
          <div className="grid gap-4">
            {results.map((product) => (
              <div
                key={product.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      ${product.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.currency}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{product.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {product.metalType}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>{" "}
                    {product.category}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span>{" "}
                    {product.weight} {product.weightUnit}
                  </div>
                  <div>
                    <span className="font-medium">Purity:</span>{" "}
                    {product.purity}
                  </div>
                  <div>
                    <span className="font-medium">Condition:</span>{" "}
                    {product.condition}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span>{" "}
                    {product.stockCount}
                  </div>
                  <div>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                  {searchType === "vector" && (
                    <div>
                      <span className="font-medium">Similarity:</span>{" "}
                      {(product.similarity_score * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && query && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your query.
        </div>
      )}
    </div>
  );
}
