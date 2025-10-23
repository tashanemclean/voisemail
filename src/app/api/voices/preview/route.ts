import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AIProcessor } from "@/lib/ai-processor";

export async function POST(request: Request) {
	try {
		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { clerkId },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const body = await request.json();
		const { voiceId, text, modelId, settings } = body;

		if (!voiceId || !text) {
			return NextResponse.json(
				{ error: "voiceId and text are required" },
				{ status: 400 }
			);
		}

		const aiProcessor = new AIProcessor();
		const audioUrl = await aiProcessor.generateAudio(
			text,
			user.id,
			"preview",
			voiceId,
			modelId || "eleven_turbo_v2_5",
			settings
		);

		return NextResponse.json({ audioUrl });
	} catch (error) {
		console.error("Error generating voice preview:", error);
		return NextResponse.json(
			{ error: "Failed to generate preview" },
			{ status: 500 }
		);
	}
}
