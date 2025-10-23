import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
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

		const user = await prisma.user.findUnique({
			where: { clerkId },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const email = await prisma.email.findFirst({
			where: {
				id: params.id,
				userId: user.id,
			},
			include: {
				insights: true,
				attachments: true,
			},
		});

		if (!email) {
			return NextResponse.json(
				{ error: "Email not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(email);
	} catch (error) {
		console.error("Error fetching email:", error);
		return NextResponse.json(
			{ error: "Failed to fetch email" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		const user = await prisma.user.findUnique({
			where: { clerkId },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		await prisma.email.delete({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting email:", error);
		return NextResponse.json(
			{ error: "Failed to delete email" },
			{ status: 500 }
		);
	}
}
