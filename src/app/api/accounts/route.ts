import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
import { getEmailAccounts } from "@/lib/db/email-accounts";

export async function GET() {
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

		const accounts = await getEmailAccounts(user.id);

		return NextResponse.json({
			accounts,
			total: accounts.length,
		});
	} catch (error) {
		console.error("Error fetching accounts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch accounts" },
			{ status: 500 }
		);
	}
}
