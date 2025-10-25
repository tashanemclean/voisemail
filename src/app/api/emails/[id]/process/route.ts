import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
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

		const user = await findUserByClerkId(clerkId);
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const emailService = new EmailService();
		const result = await emailService.processEmail(params.id);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error processing email:", error);
		return NextResponse.json(
			{ error: "Failed to process email" },
			{ status: 500 }
		);
	}
}
