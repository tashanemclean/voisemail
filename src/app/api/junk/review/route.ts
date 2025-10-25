import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
import { getJunkEmailsForReview } from "@/lib/db/emails";
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

		const user = await findUserByClerkId(clerkId);
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const { searchParams } = new URL(request.url);
		const syncFirst = searchParams.get("sync") === "true";

		if (syncFirst) {
			const emailService = new EmailService();
			try {
				await emailService.syncJunkEmails(user.id);
			} catch (error) {
				console.error("Error syncing junk emails:", error);
			}
		}

		const junkEmails = await getJunkEmailsForReview(user.id);

		const formattedEmails = junkEmails.map((email) => ({
			id: email.id,
			external_id: email.external_id,
			subject: email.subject,
			from: email.from,
			to: email.to,
			body: email.body,
			snippet: email.snippet,
			received_at: email.received_at,
			is_junk: email.is_junk,
			confidence: email.confidence,
			ai_reason: email.ai_reason,
			aiRecommendation: email.is_junk ? "junk" : "legitimate",
		}));

		return NextResponse.json({
			emails: formattedEmails,
			total: formattedEmails.length,
		});
	} catch (error) {
		console.error("Error fetching junk emails:", error);
		return NextResponse.json(
			{ error: "Failed to fetch junk emails" },
			{ status: 500 }
		);
	}
}
