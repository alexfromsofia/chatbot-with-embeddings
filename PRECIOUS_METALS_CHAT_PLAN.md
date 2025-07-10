# 🏆 Precious Metals Chat Agent Setup Plan

## Overview

Build an intelligent chat agent for a precious metals online shop that can recommend products using vector similarity search with pgvector.

## 🗄️ Database Schema (Completed)

### Enums for Type Safety

- **MetalType**: GOLD, SILVER, PLATINUM, PALLADIUM, RHODIUM, COPPER
- **ProductCategory**: COINS, BARS, ROUNDS, JEWELRY, INVESTMENT, COLLECTIBLE
- **ProductCondition**: NEW, MINT, EXCELLENT, VERY_GOOD, GOOD, FAIR
- **OrderStatus**: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
- **PaymentMethod**: CREDIT_CARD, BANK_TRANSFER, CRYPTO, WIRE_TRANSFER

### Core Models

1. **Product** - Precious metals products with vector embeddings
2. **Customer** - Customer information
3. **Order** - Purchase orders
4. **OrderItem** - Order line items
5. **ChatSession** - Chat conversations
6. **Message** - Chat messages with embeddings
7. **Embedding** - General purpose vector storage

## 🚀 Implementation Phases

### Phase 1: Database & Product Data ✅

- [x] Set up PostgreSQL with pgvector
- [x] Create Prisma schema with enums
- [x] Generate seed data with 10+ products
- [x] Add vector embeddings for semantic search

### Phase 2: Vector Search Infrastructure

- [ ] Create product search API
- [ ] Implement similarity search with filters
- [ ] Add product recommendation engine
- [ ] Build embedding generation pipeline

### Phase 3: Chat Agent Intelligence

- [ ] Integrate with Claude API
- [ ] Create conversation context management
- [ ] Implement product recommendation logic
- [ ] Add conversation memory with embeddings

### Phase 4: User Interface

- [ ] Build chat interface
- [ ] Add product display cards
- [ ] Implement shopping cart integration
- [ ] Create order management system

### Phase 5: Advanced Features

- [ ] Price alerts and notifications
- [ ] Portfolio tracking
- [ ] Market data integration
- [ ] Customer analytics

## 🔧 Technical Implementation

### Vector Search Strategy

```typescript
// Product search with filters
const searchProducts = async (
  query: string,
  filters: {
    metalType?: MetalType;
    category?: ProductCategory;
    maxPrice?: number;
    minPurity?: number;
  }
) => {
  const queryEmbedding = await generateEmbedding(query);
  return await prisma.$queryRaw`
    SELECT 
      p.*,
      1 - (p.embedding <=> ${queryEmbedding}::vector) as similarity
    FROM products p
    WHERE 1 - (p.embedding <=> ${queryEmbedding}::vector) > 0.7
      ${filters.metalType ? `AND p.metal_type = ${filters.metalType}` : ""}
      ${filters.category ? `AND p.category = ${filters.category}` : ""}
      ${filters.maxPrice ? `AND p.price <= ${filters.maxPrice}` : ""}
      ${filters.minPurity ? `AND p.purity >= ${filters.minPurity}` : ""}
    ORDER BY similarity DESC
    LIMIT 5
  `;
};
```

### Chat Agent Flow

1. **User Input** → Generate embedding
2. **Search Products** → Find similar products using vector similarity
3. **Context Analysis** → Understand user intent and preferences
4. **Generate Response** → Claude creates personalized recommendations
5. **Store Conversation** → Save chat with embeddings for memory

### Product Recommendation Logic

```typescript
const recommendProducts = async (userQuery: string, chatHistory: Message[]) => {
  // 1. Generate embedding for user query
  const queryEmbedding = await generateEmbedding(userQuery);

  // 2. Search similar products
  const similarProducts = await searchProducts(queryEmbedding);

  // 3. Analyze chat history for preferences
  const userPreferences = analyzeChatHistory(chatHistory);

  // 4. Filter and rank products
  const recommendations = rankProducts(similarProducts, userPreferences);

  // 5. Generate personalized response
  return await generateRecommendationResponse(recommendations, userQuery);
};
```

## 📊 Sample Product Data

### Gold Products

- American Gold Eagle 1 oz Coin ($2,150)
- PAMP Suisse 100g Gold Bar ($6,900)
- 14k Gold Chain Necklace ($450)

### Silver Products

- Canadian Maple Leaf 1 oz Silver Coin ($28.50)
- Walking Liberty Silver Round ($26.75)
- Silver Investment Bundle 10 oz ($265)

### Platinum & Palladium

- Platinum Eagle 1 oz Coin ($1,050)
- Palladium Bar 1 oz ($1,200)
- Rhodium Bar 1 oz ($8,500)

### Collectibles

- Saint-Gaudens Double Eagle 1924 ($2,200)

## 🎯 Chat Agent Capabilities

### Product Discovery

- "I'm looking for gold investment options"
- "Show me silver coins under $50"
- "What platinum products do you have?"
- "I want collectible coins"

### Investment Advice

- "What's the best way to start investing in precious metals?"
- "Should I buy gold or silver?"
- "What's the difference between coins and bars?"
- "Are these IRA eligible?"

### Shopping Assistance

- "Add this to my cart"
- "What's the shipping cost?"
- "Do you offer payment plans?"
- "Can I get a discount for bulk purchase?"

## 🔄 Next Steps

1. **Fix Database Issues**

   - Resolve Prisma client generation
   - Run seed script successfully
   - Verify vector operations

2. **Build Search API**

   - Create `/api/products/search` endpoint
   - Implement similarity search with filters
   - Add product recommendation logic

3. **Enhance Chat Agent**

   - Integrate product search with Claude
   - Add conversation context management
   - Implement recommendation responses

4. **Create UI Components**
   - Chat interface with product cards
   - Product detail modals
   - Shopping cart integration

## 🛠️ Development Commands

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed with product data
npm run db:studio      # Open database browser

# Development
npm run dev            # Start development server
npm run build          # Build for production
```

## 📈 Success Metrics

- **Product Discovery**: Users find relevant products quickly
- **Conversion Rate**: Chat leads to purchases
- **User Satisfaction**: Positive feedback on recommendations
- **Search Accuracy**: Relevant products appear in top results

---

_This plan provides a comprehensive roadmap for building an intelligent precious metals chat agent with vector search capabilities._
