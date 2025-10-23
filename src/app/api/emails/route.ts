import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
		const folder = searchParams.get("folder") || "inbox";
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "50");
		const skip = (page - 1) * limit;

		const [emails, total] = await Promise.all([
			prisma.email.findMany({
				where: {
					userId: user.id,
					folder,
				},
				include: {
					insights: true,
				},
				orderBy: {
					receivedAt: "desc",
				},
				take: limit,
				skip,
			}),
			prisma.email.count({
				where: {
					userId: user.id,
					folder,
				},
			}),
		]);

		return NextResponse.json({
			emails,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching emails:", error);
		return NextResponse.json(
			{ error: "Failed to fetch emails" },
			{ status: 500 }
		);
	}
}
