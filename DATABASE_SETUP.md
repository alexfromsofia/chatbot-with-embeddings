# Database Setup Guide

This project uses PostgreSQL with the pgvector extension for vector similarity search and storage.

## Prerequisites

1. **PostgreSQL** (version 12 or higher)
2. **pgvector extension** installed

## Installation

### Option 1: Using Docker (Recommended)

```bash
# Create a PostgreSQL container with pgvector
docker run --name ai-playground-db \
  -e POSTGRES_DB=ai_playground \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d pgvector/pgvector:pg17
```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Install pgvector extension:

   ```bash
   # On macOS with Homebrew
   brew install pgvector

   # On Ubuntu/Debian
   sudo apt-get install postgresql-14-pgvector
   ```

## Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_playground?schema=public"
```

## Database Setup

1. **Generate Prisma client:**

   ```bash
   npm run db:generate
   ```

2. **Push schema to database:**

   ```bash
   npm run db:push
   ```

3. **Or run migrations:**
   ```bash
   npm run db:migrate
   ```

## Database Schema

The database includes the following tables:

### `chat_sessions`

- Stores chat conversation sessions
- Fields: `id`, `title`, `createdAt`, `updatedAt`

### `messages`

- Stores individual chat messages with optional embeddings
- Fields: `id`, `role`, `content`, `embedding`, `sessionId`, `createdAt`
- Supports vector similarity search on embeddings

### `embeddings`

- Stores text embeddings for semantic search
- Fields: `id`, `text`, `embedding`, `metadata`, `createdAt`
- Optimized for vector similarity queries

## Usage Examples

### Store an embedding

```typescript
import { VectorStore } from '@/lib/vector'

const embedding = [0.1, 0.2, 0.3, ...] // 1536-dimensional vector
await VectorStore.storeEmbedding(
  "Sample text",
  embedding,
  { source: "document", category: "example" }
)
```

### Search similar embeddings

```typescript
const queryEmbedding = [0.1, 0.2, 0.3, ...]
const results = await VectorStore.similaritySearch(
  queryEmbedding,
  5,    // limit
  0.7   // similarity threshold
)
```

### Store chat messages

```typescript
const session = await VectorStore.createChatSession("My Chat");
await VectorStore.storeMessage(
  session.id,
  "user",
  "Hello, how are you?",
  userEmbedding
);
```

## API Endpoints

### POST `/api/vector`

Store embeddings, search, and manage chat sessions:

```javascript
// Store embedding
fetch("/api/vector", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "store",
    data: { text, embedding, metadata },
  }),
});

// Search embeddings
fetch("/api/vector", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "search",
    data: { queryEmbedding, limit, threshold },
  }),
});
```

### GET `/api/vector?sessionId=<id>`

Retrieve chat history for a session.

## Development Tools

- **Prisma Studio:** `npm run db:studio` - Visual database browser
- **Generate Client:** `npm run db:generate` - Update Prisma client
- **Push Schema:** `npm run db:push` - Sync schema changes
- **Run Migrations:** `npm run db:migrate` - Apply migrations

## Vector Operations

The pgvector extension supports several similarity metrics:

- **Cosine Distance:** `<=>` operator
- **Euclidean Distance:** `<->` operator
- **Negative Inner Product:** `<#>` operator

The current implementation uses cosine similarity for semantic search.
