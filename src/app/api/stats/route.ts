import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";

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
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const emailService = new EmailService();
		const stats = await emailService.getEmailStats(user.id);

		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stats" },
			{ status: 500 }
		);
	}
}
