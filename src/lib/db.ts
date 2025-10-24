import { PrismaClient } from "@prisma/client";

declare global {
	var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
	return new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prisma;
}

// Connection test function
export async function ensurePrismaConnection() {
	try {
		await prisma.$connect();
		console.log("✅ Prisma connected to database");
		return true;
	} catch (error) {
		console.error("❌ Prisma connection failed:", error);
		throw error;
	}
}

// Graceful shutdown
if (process.env.NODE_ENV === "production") {
	process.on("beforeExit", async () => {
		await prisma.$disconnect();
	});
}
