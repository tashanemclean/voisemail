import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";

export async function POST() {
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

		const emailService = new EmailService();
		const syncedCount = await emailService.syncEmails(user.id);

		return NextResponse.json({
			success: true,
			syncedCount,
		});
	} catch (error) {
		console.error("Error syncing emails:", error);
		return NextResponse.json(
			{ error: "Failed to sync emails" },
			{ status: 500 }
		);
	}
}
