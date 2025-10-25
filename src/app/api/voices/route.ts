import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AIProcessor } from "@/lib/ai-processor";

export async function GET() {
	try {
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const aiProcessor = new AIProcessor();
		const voices = await aiProcessor.getAvailableVoices();

		return NextResponse.json({ voices });
	} catch (error) {
		console.error("Error fetching voices:", error);
		return NextResponse.json(
			{ error: "Failed to fetch voices" },
			{ status: 500 }
		);
	}
}
