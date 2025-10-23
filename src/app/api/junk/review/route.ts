import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";

export async function GET(request: Request) {
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

		const { searchParams } = new URL(request.url);
		const syncFirst = searchParams.get("sync") === "true";

		// Optionally sync junk emails first
		if (syncFirst) {
			const emailService = new EmailService();
			try {
				await emailService.syncJunkEmails(user.id);
			} catch (error) {
				console.error("Error syncing junk emails:", error);
				// Continue even if sync fails
			}
		}

		// Get junk emails that need review (not confirmed yet)
		const junkEmails = await prisma.email.findMany({
			where: {
				userId: user.id,
				folder: "junk",
				junkConfirmed: false,
			},
			orderBy: {
				receivedAt: "desc",
			},
			take: 50,
		});

		// Format the response
		const formattedEmails = junkEmails.map((email) => ({
			id: email.id,
			externalId: email.externalId,
			subject: email.subject,
			from: email.from,
			to: email.to,
			body: email.body,
			snippet: email.snippet,
			receivedAt: email.receivedAt,
			isJunk: email.isJunk,
			confidence: email.confidence,
			aiReason: email.aiReason,
			aiRecommendation: email.isJunk ? "junk" : "legitimate",
		}));

		return NextResponse.json({
			emails: formattedEmails,
			total: formattedEmails.length,
		});
	} catch (error) {
		console.error("Error fetching junk emails for review:", error);
		return NextResponse.json(
			{ error: "Failed to fetch junk emails" },
			{ status: 500 }
		);
	}
}
