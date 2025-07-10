import {
  PrismaClient,
  MetalType,
  ProductCategory,
  ProductCondition,
  Currency,
  PurityLevel,
  WeightUnit,
  MintType,
  CoinGrade,
  JewelryType,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

// Mock embedding function - in production, use OpenAI's embedding API
const generateMockEmbedding = (): number[] => {
  return Array.from({ length: 1536 }, () => Math.random() - 0.5);
};

const products = [
  {
    name: "American Gold Eagle 1 oz Coin",
    description:
      "Official US Mint gold bullion coin, 1 troy ounce of 22-karat gold with 1/10 oz copper and 1/20 oz silver. Features Lady Liberty on obverse and eagle on reverse. Perfect for investment and IRA accounts.",
    metalType: MetalType.GOLD,
    category: ProductCategory.COINS,
    condition: ProductCondition.MINT,
    weight: 31.1035, // 1 troy ounce in grams
    weightUnit: WeightUnit.GRAMS,
    purity: 91.67, // 22k gold
    purityLevel: PurityLevel.PURE_916,
    price: 2150.0,
    currency: Currency.USD,
    sku: "AGE-1OZ-2024",
    stockCount: 50,
    mint: MintType.US_MINT,
    grade: CoinGrade.UNCIRCULATED,
    metadata: {
      year: 2024,
      diameter: "32.7mm",
      thickness: "2.87mm",
      iraEligible: true,
      country: "USA",
    },
  },
  {
    name: "Canadian Maple Leaf 1 oz Silver Coin",
    description:
      "99.99% pure silver bullion coin from Royal Canadian Mint. Features maple leaf design with Queen Elizabeth II. Highly liquid and recognized worldwide for investment.",
    metalType: MetalType.SILVER,
    category: ProductCategory.COINS,
    condition: ProductCondition.MINT,
    weight: 31.1035,
    weightUnit: WeightUnit.GRAMS,
    purity: 99.99,
    purityLevel: PurityLevel.PURE_9999,
    price: 28.5,
    currency: Currency.USD,
    sku: "CML-1OZ-2024",
    stockCount: 200,
    mint: MintType.ROYAL_CANADIAN_MINT,
    grade: CoinGrade.UNCIRCULATED,
    metadata: {
      year: 2024,
      diameter: "38mm",
      thickness: "3.29mm",
      iraEligible: true,
      country: "Canada",
    },
  },
  {
    name: "PAMP Suisse 100g Gold Bar",
    description:
      "Premium 99.99% pure gold bar from PAMP Suisse with assay certificate. Features Lady Fortuna design. Ideal for serious investors and portfolio diversification.",
    metalType: MetalType.GOLD,
    category: ProductCategory.BARS,
    condition: ProductCondition.NEW,
    weight: 100,
    weightUnit: WeightUnit.GRAMS,
    purity: 99.99,
    purityLevel: PurityLevel.PURE_9999,
    price: 6900.0,
    currency: Currency.USD,
    sku: "PAMP-100G-GOLD",
    stockCount: 25,
    mint: MintType.PAMP_SUISSE,
    metadata: {
      dimensions: "55mm x 31mm x 3mm",
      assayCertificate: true,
      serialNumbered: true,
      iraEligible: true,
    },
  },
  {
    name: "Platinum Eagle 1 oz Coin",
    description:
      "Official US Mint platinum bullion coin, 1 troy ounce of 99.95% pure platinum. Features Lady Liberty and eagle designs. Rare and valuable investment option.",
    metalType: MetalType.PLATINUM,
    category: ProductCategory.COINS,
    condition: ProductCondition.MINT,
    weight: 31.1035,
    weightUnit: WeightUnit.GRAMS,
    purity: 99.95,
    purityLevel: PurityLevel.PURE_9995,
    price: 1050.0,
    currency: Currency.USD,
    sku: "PE-1OZ-2024",
    stockCount: 15,
    mint: MintType.US_MINT,
    grade: CoinGrade.UNCIRCULATED,
    metadata: {
      year: 2024,
      diameter: "32.7mm",
      thickness: "2.75mm",
      iraEligible: true,
      country: "USA",
    },
  },
  {
    name: "Silver Round - Walking Liberty Design",
    description:
      "1 troy ounce 99.9% pure silver round featuring the classic Walking Liberty design. Beautiful collectible and investment piece with historical significance.",
    metalType: MetalType.SILVER,
    category: ProductCategory.ROUNDS,
    condition: ProductCondition.NEW,
    weight: 31.1035,
    weightUnit: WeightUnit.GRAMS,
    purity: 99.9,
    purityLevel: PurityLevel.PURE_999,
    price: 26.75,
    currency: Currency.USD,
    sku: "WL-SILVER-1OZ",
    stockCount: 150,
    mint: MintType.GENERIC,
    metadata: {
      design: "Walking Liberty",
      diameter: "39mm",
      thickness: "2.5mm",
      iraEligible: false,
      collectible: true,
    },
  },
  {
    name: "Palladium Bar 1 oz",
    description:
      "99.95% pure palladium bar, 1 troy ounce. Rare precious metal with industrial and investment applications. Excellent for portfolio diversification.",
    metalType: MetalType.PALLADIUM,
    category: ProductCategory.BARS,
    condition: ProductCondition.NEW,
    weight: 31.1035,
    weightUnit: WeightUnit.GRAMS,
    purity: 99.95,
    purityLevel: PurityLevel.PURE_9995,
    price: 1200.0,
    currency: Currency.USD,
    sku: "PALLADIUM-1OZ",
    stockCount: 30,
    mint: MintType.GENERIC,
    metadata: {
      dimensions: "40mm x 20mm x 2mm",
      assayCertificate: true,
      iraEligible: true,
    },
  },
  {
    name: "Gold Jewelry - 14k Chain Necklace",
    description:
      "Elegant 14-karat gold chain necklace, 18 inches long. Perfect for everyday wear or as a gift. Combines beauty with investment value.",
    metalType: MetalType.GOLD,
    category: ProductCategory.JEWELRY,
    condition: ProductCondition.NEW,
    weight: 8.5,
    weightUnit: WeightUnit.GRAMS,
    purity: 58.33, // 14k gold
    purityLevel: PurityLevel.PURE_585,
    price: 450.0,
    currency: Currency.USD,
    sku: "GOLD-CHAIN-14K",
    stockCount: 75,
    jewelryType: JewelryType.CHAIN,
    metadata: {
      length: "18 inches",
      style: "Chain",
      clasp: "Lobster",
      giftBox: true,
      warranty: "1 year",
    },
  },
  {
    name: "Silver Investment Bundle - 10 oz",
    description:
      "Bundle of 10 one-ounce silver rounds, perfect for starting a silver investment portfolio. Includes variety of designs and excellent value.",
    metalType: MetalType.SILVER,
    category: ProductCategory.INVESTMENT,
    condition: ProductCondition.NEW,
    weight: 311.035, // 10 troy ounces
    weightUnit: WeightUnit.GRAMS,
    purity: 99.9,
    purityLevel: PurityLevel.PURE_999,
    price: 265.0,
    currency: Currency.USD,
    sku: "SILVER-BUNDLE-10OZ",
    stockCount: 40,
    mint: MintType.GENERIC,
    metadata: {
      bundleSize: 10,
      variety: true,
      iraEligible: false,
      starterKit: true,
    },
  },
  {
    name: "Collectible Gold Coin - Saint-Gaudens Double Eagle",
    description:
      "Historic 1924 Saint-Gaudens Double Eagle gold coin. 90% gold, 10% copper. Rare collectible with numismatic value beyond gold content.",
    metalType: MetalType.GOLD,
    category: ProductCategory.COLLECTIBLE,
    condition: ProductCondition.VERY_GOOD,
    weight: 33.436,
    weightUnit: WeightUnit.GRAMS,
    purity: 90.0,
    purityLevel: PurityLevel.PURE_900,
    price: 2200.0,
    currency: Currency.USD,
    sku: "SGD-1924",
    stockCount: 5,
    mint: MintType.US_MINT,
    grade: CoinGrade.VERY_GOOD,
    metadata: {
      year: 1924,
      grade: "VG",
      numismaticValue: true,
      historical: true,
    },
  },
  {
    name: "Rhodium Bar 1 oz",
    description:
      "Ultra-rare 99.95% pure rhodium bar, 1 troy ounce. One of the rarest precious metals, highly valued for industrial and investment use.",
    metalType: MetalType.RHODIUM,
    category: ProductCategory.BARS,
    condition: ProductCondition.NEW,
    weight: 31.1035,
    weightUnit: WeightUnit.GRAMS,
    purity: 99.95,
    purityLevel: PurityLevel.PURE_9995,
    price: 8500.0,
    currency: Currency.USD,
    sku: "RHODIUM-1OZ",
    stockCount: 8,
    mint: MintType.GENERIC,
    metadata: {
      dimensions: "35mm x 18mm x 2.5mm",
      assayCertificate: true,
      ultraRare: true,
    },
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing products
  await prisma.product.deleteMany();
  console.log("🗑️  Cleared existing products");

  // Step 1: Create products without embeddings
  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        // Do not include embedding property
      },
    });
    createdProducts.push(createdProduct);
  }

  console.log(`✅ Created ${createdProducts.length} products`);

  // Step 2: Add embeddings using raw SQL for pgvector
  console.log("🔗 Adding embeddings...");
  for (const product of createdProducts) {
    const embedding = generateMockEmbedding();
    const embeddingArray = `[${embedding.join(",")}]`;
    await prisma.$executeRaw`\
      UPDATE products \
      SET embedding = ${embeddingArray}::vector \
      WHERE id = ${product.id}
    `;
  }

  console.log(`✅ Seeded ${products.length} products with embeddings`);

  // Create some sample customers
  const customers = [
    {
      email: "john.doe@example.com",
      name: "John Doe",
      phone: "+1-555-0123",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
      },
    },
    {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      phone: "+1-555-0456",
      address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        country: "USA",
      },
    },
  ];

  await prisma.customer.deleteMany();
  for (const customer of customers) {
    await prisma.customer.create({ data: customer });
  }

  console.log(`✅ Seeded ${customers.length} customers`);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
