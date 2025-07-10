-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'RHODIUM', 'COPPER', 'BRONZE', 'NICKEL');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('COINS', 'BARS', 'ROUNDS', 'JEWELRY', 'INVESTMENT', 'COLLECTIBLE', 'MEDALS', 'INGOTS');

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'MINT', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'CRYPTO', 'WIRE_TRANSFER', 'PAYPAL', 'CHECK', 'MONEY_ORDER');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY', 'CNY');

-- CreateEnum
CREATE TYPE "PurityLevel" AS ENUM ('PURE_9999', 'PURE_9995', 'PURE_999', 'PURE_995', 'PURE_990', 'PURE_958', 'PURE_916', 'PURE_750', 'PURE_585', 'PURE_375', 'PURE_900', 'PURE_800');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('GRAMS', 'OUNCES', 'TROY_OUNCES', 'KILOGRAMS', 'POUNDS');

-- CreateEnum
CREATE TYPE "JewelryType" AS ENUM ('NECKLACE', 'RING', 'BRACELET', 'EARRINGS', 'PENDANT', 'CHAIN', 'WATCH', 'CUFFLINKS');

-- CreateEnum
CREATE TYPE "MintType" AS ENUM ('US_MINT', 'ROYAL_CANADIAN_MINT', 'ROYAL_MINT', 'PERTH_MINT', 'PAMP_SUISSE', 'VALCAMBI', 'GENERIC', 'PRIVATE_MINT');

-- CreateEnum
CREATE TYPE "CoinGrade" AS ENUM ('PROOF', 'UNCIRCULATED', 'EXTREMELY_FINE', 'VERY_FINE', 'FINE', 'VERY_GOOD', 'GOOD', 'ABOUT_GOOD', 'FAIR', 'POOR');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "condition" "ProductCondition" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "weightUnit" "WeightUnit" NOT NULL DEFAULT 'GRAMS',
    "purity" DOUBLE PRECISION NOT NULL,
    "purityLevel" "PurityLevel",
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "sku" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stockCount" INTEGER NOT NULL DEFAULT 0,
    "embedding" vector(1536) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mint" "MintType",
    "grade" "CoinGrade",
    "jewelryType" "JewelryType",

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "shippingAddress" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
