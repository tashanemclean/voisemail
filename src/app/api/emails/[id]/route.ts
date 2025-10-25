import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId } from "@/lib/db/users";
import { getEmailById, deleteEmail } from "@/lib/db/emails";

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

		const user = await findUserByClerkId(clerkId);
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const email = await getEmailById(params.id, user.id);
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

		const user = await findUserByClerkId(clerkId);
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		await deleteEmail(params.id, user.id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting email:", error);
		return NextResponse.json(
			{ error: "Failed to delete email" },
			{ status: 500 }
		);
	}
}
