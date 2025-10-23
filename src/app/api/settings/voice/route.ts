import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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
			include: { voiceSettings: true },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		if (!user.voiceSettings) {
			return NextResponse.json({
				voiceId: "21m00Tcm4TlvDq8ikWAM",
				voiceName: "Rachel",
				modelId: "eleven_turbo_v2_5",
				stability: 0.6,
				similarityBoost: 0.8,
				style: 0.2,
				useSpeakerBoost: true,
			});
		}

		return NextResponse.json(user.voiceSettings);
	} catch (error) {
		console.error("Error fetching voice settings:", error);
		return NextResponse.json(
			{ error: "Failed to fetch settings" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
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
		const {
			voiceId,
			voiceName,
			modelId,
			stability,
			similarityBoost,
			style,
			useSpeakerBoost,
		} = body;

		if (stability !== undefined && (stability < 0 || stability > 1)) {
			return NextResponse.json(
				{ error: "Stability must be between 0 and 1" },
				{ status: 400 }
			);
		}

		if (
			similarityBoost !== undefined &&
			(similarityBoost < 0 || similarityBoost > 1)
		) {
			return NextResponse.json(
				{ error: "Similarity boost must be between 0 and 1" },
				{ status: 400 }
			);
		}

		if (style !== undefined && (style < 0 || style > 1)) {
			return NextResponse.json(
				{ error: "Style must be between 0 and 1" },
				{ status: 400 }
			);
		}

		const voiceSettings = await prisma.voiceSettings.upsert({
			where: { userId: user.id },
			update: {
				voiceId,
				voiceName,
				modelId,
				stability,
				similarityBoost,
				style,
				useSpeakerBoost,
			},
			create: {
				userId: user.id,
				voiceId,
				voiceName,
				modelId,
				stability,
				similarityBoost,
				style,
				useSpeakerBoost,
			},
		});

		return NextResponse.json(voiceSettings);
	} catch (error) {
		console.error("Error updating voice settings:", error);
		return NextResponse.json(
			{ error: "Failed to update settings" },
			{ status: 500 }
		);
	}
}
