import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
		const { accountId } = body;

		if (!accountId) {
			return NextResponse.json(
				{ error: "Account ID required" },
				{ status: 400 }
			);
		}

		// Verify the account belongs to the user
		const account = await prisma.emailAccount.findFirst({
			where: {
				id: accountId,
				userId: user.id,
			},
		});

		if (!account) {
			return NextResponse.json(
				{ error: "Account not found" },
				{ status: 404 }
			);
		}

		// Delete the email account (this will cascade delete related emails)
		await prisma.emailAccount.delete({
			where: { id: accountId },
		});

		console.log(`Gmail account disconnected: ${account.email}`);

		return NextResponse.json({
			success: true,
			message: "Email account disconnected successfully",
			email: account.email,
		});
	} catch (error) {
		console.error("Error disconnecting account:", error);
		return NextResponse.json(
			{ error: "Failed to disconnect account" },
			{ status: 500 }
		);
	}
}
