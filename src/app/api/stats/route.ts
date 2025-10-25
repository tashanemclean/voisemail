import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
import { getEmailStats } from "@/lib/db/stats";

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

		const stats = await getEmailStats(user.id);
		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stats" },
			{ status: 500 }
		);
	}
}
