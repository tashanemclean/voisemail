import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/lib/email-service";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
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
		const { isJunk } = body;

		if (typeof isJunk !== "boolean") {
			return NextResponse.json(
				{ error: "Invalid request" },
				{ status: 400 }
			);
		}

		const emailService = new EmailService();
		await emailService.confirmJunkStatus(params.id, isJunk, user.id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error confirming junk status:", error);
		return NextResponse.json(
			{ error: "Failed to confirm junk status" },
			{ status: 500 }
		);
	}
}
