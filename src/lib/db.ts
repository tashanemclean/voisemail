// lib/db.js (The Definitive, Modern Fix)

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
// 🛑 REMOVE: We no longer need to import 'Pool'
// import { Pool } from "@neondatabase/serverless";
// You can optionally keep 'neon' if you need the 'neonConfig' for edge environments
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Ensure WebSockets are used in a Node.js environment (e.g., Vercel Serverless Function)
// If you are using Vercel Edge, you might need to adjust this, but for standard
// Serverless Functions, using a WebSocket constructor is correct.
neonConfig.webSocketConstructor = ws;

// 1. Get the connection string from environment variables.
const connectionString = process.env.DATABASE_URL;

// 2. Create the adapter instance by passing the *configuration object* //    containing the connection string.
// ✅ This resolves the 'Pool' vs 'PoolConfig' error.
const adapter = new PrismaNeon({ connectionString });

// 3. Use the standard Next.js global check (best practice)
const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		// 4. Pass the adapter to the Prisma Client
		adapter: adapter,
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
