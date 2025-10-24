import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
			include: {
				emailAccounts: {
					select: {
						id: true,
						provider: true,
						email: true,
						isActive: true,
						createdAt: true,
						updatedAt: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			accounts: user.emailAccounts,
			total: user.emailAccounts.length,
		});
	} catch (error) {
		console.error("Error fetching accounts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch accounts" },
			{ status: 500 }
		);
	}
}
