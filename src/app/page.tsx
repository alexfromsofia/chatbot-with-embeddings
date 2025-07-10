"use client";

import VectorSearchDemo from "../components/VectorSearchDemo";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Playground</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vector Search Demo */}
          <div className="order-2 lg:order-1">
            <VectorSearchDemo />
          </div>
        </div>
      </main>
    </div>
  );
}
