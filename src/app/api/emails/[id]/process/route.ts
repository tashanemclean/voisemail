import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";

export async function POST(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params; // ✅ await the params

		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await prisma.user.findUnique({ where: { clerkId } });

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const email = await prisma.email.findFirst({
			where: { id, userId: user.id },
		});

		if (!email) {
			return NextResponse.json(
				{ error: "Email not found" },
				{ status: 404 }
			);
		}

		const emailService = new EmailService();
		const result = await emailService.processEmail(id);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error processing email:", error);
		return NextResponse.json(
			{ error: "Failed to process email" },
			{ status: 500 }
		);
	}
}
