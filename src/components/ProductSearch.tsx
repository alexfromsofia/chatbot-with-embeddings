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
  purity: number;
  price: number;
  currency: string;
  sku: string;
  stockCount: number;
  metadata: Record<string, unknown>;
  mint: string | null;
  grade: string | null;
  jewelryType: string | null;
  relevance_score: number;
}

interface SearchResponse {
  query: string;
  results: Product[];
  filters: Record<string, string>;
  total: number;
}

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    metalType: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: "10",
        ...(filters.category && { category: filters.category }),
        ...(filters.metalType && { metalType: filters.metalType }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      });

      const response = await fetch(`/api/products/search?${params}`);
      const data: SearchResponse = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        console.error("Search failed:", data);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Precious Metals Product Search
      </h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for gold coins, silver bars, platinum jewelry..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="COINS">Coins</option>
            <option value="BARS">Bars</option>
            <option value="ROUNDS">Rounds</option>
            <option value="JEWELRY">Jewelry</option>
            <option value="INVESTMENT">Investment</option>
            <option value="COLLECTIBLE">Collectible</option>
          </select>

          <select
            value={filters.metalType}
            onChange={(e) => handleFilterChange("metalType", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Metals</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="PLATINUM">Platinum</option>
            <option value="PALLADIUM">Palladium</option>
            <option value="RHODIUM">Rhodium</option>
          </select>

          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            placeholder="Min Price"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            placeholder="Max Price"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Found {results.length} products
          </h2>

          <div className="grid gap-4">
            {results.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${product.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.currency}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{product.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Metal:</span>{" "}
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
                    {product.purity}%
                  </div>
                  <div>
                    <span className="font-medium">Condition:</span>{" "}
                    {product.condition}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span>{" "}
                    {product.stockCount} units
                  </div>
                  <div>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                  <div>
                    <span className="font-medium">Relevance:</span>{" "}
                    {(product.relevance_score * 100).toFixed(1)}%
                  </div>
                </div>

                {product.metadata && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Additional Details:
                    </div>
                    <div className="text-sm text-gray-600">
                      {Object.entries(product.metadata).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span>{" "}
                          {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && query && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No products found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
