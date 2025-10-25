import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
import { getEmails } from "@/lib/db/emails";

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
		const folder = searchParams.get("folder") || "inbox";
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "50");

		const result = await getEmails(user.id, folder, page, limit);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error fetching emails:", error);
		return NextResponse.json(
			{ error: "Failed to fetch emails" },
			{ status: 500 }
		);
	}
}
