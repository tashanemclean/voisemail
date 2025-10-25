import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
import { deleteEmailAccount, getEmailAccounts } from "@/lib/db/email-accounts";

export async function POST(request: Request) {
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

		const body = await request.json();
		const { accountId } = body;

		if (!accountId) {
			return NextResponse.json(
				{ error: "Account ID required" },
				{ status: 400 }
			);
		}

		const accounts = await getEmailAccounts(user.id);
		const account = accounts.find((a) => a.id === accountId);

		if (!account) {
			return NextResponse.json(
				{ error: "Account not found" },
				{ status: 404 }
			);
		}

		await deleteEmailAccount(accountId, user.id);

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
