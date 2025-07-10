import { PrismaClient, Product } from "../src/generated/prisma";
import { generateOpenAIEmbedding } from "../src/lib/openai";

const prisma = new PrismaClient();

function productToEmbeddingText(product: Omit<Product, "embedding">): string {
  return `
    Name: ${product.name}
    Description: ${product.description}
    Metal: ${product.metalType}
    Category: ${product.category}
    Condition: ${product.condition}
    Purity: ${product.purity}
    Price: ${product.price} ${product.currency}
    Weight: ${product.weight} ${product.weightUnit}
    ${product.purityLevel ? `Purity Level: ${product.purityLevel}` : ""}
    ${product.mint ? `Mint: ${product.mint}` : ""}
    ${product.grade ? `Grade: ${product.grade}` : ""}
    ${product.jewelryType ? `Jewelry Type: ${product.jewelryType}` : ""}
    ${product.metadata ? `Metadata: ${JSON.stringify(product.metadata)}` : ""}
  `;
}

async function main() {
  // Fetch all products missing embeddings, excluding the 'embedding' column
  const productsToEmbed = await prisma.$queryRaw<
    Array<Omit<Product, "embedding">>
  >`
    SELECT id, name, description, "metalType", category, condition, weight, "weightUnit", purity, "purityLevel", price, currency, sku, "inStock", "stockCount", metadata, "createdAt", "updatedAt", mint, grade, "jewelryType"
    FROM "products" WHERE embedding IS NULL
  `;

  console.log(`Found ${productsToEmbed.length} products without embeddings.`);

  for (const product of productsToEmbed) {
    const text = productToEmbeddingText(product);
    try {
      console.log(`Embedding product: ${product.id} - ${product.name}`);
      const embedding = await generateOpenAIEmbedding(text);
      // Convert embedding to pgvector format and update using parameterized query
      await prisma.$executeRawUnsafe(
        'UPDATE "products" SET embedding = $1::vector WHERE id = $2',
        embedding,
        product.id
      );
      console.log(`Embedded and updated: ${product.name}`);
      await new Promise((res) => setTimeout(res, 200)); // avoid rate limits
    } catch (err) {
      console.error(`Failed to embed product ${product.id}:`, err);
    }
  }

  await prisma.$disconnect();
  console.log("Done embedding products.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
