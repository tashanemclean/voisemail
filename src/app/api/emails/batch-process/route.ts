import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";

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
		const limit = body.limit || 10;

		const emailService = new EmailService();
		const results = await emailService.batchProcessEmails(user.id, limit);

		return NextResponse.json({
			success: true,
			processed: results.length,
			results,
		});
	} catch (error) {
		console.error("Error batch processing emails:", error);
		return NextResponse.json(
			{ error: "Failed to batch process emails" },
			{ status: 500 }
		);
	}
}
