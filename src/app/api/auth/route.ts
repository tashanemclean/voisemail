import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findUserByClerkId, createUser } from "@/lib/db/users";

export async function GET() {
	try {
		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.json({
				authenticated: false,
				user: null,
			});
		}

		const clerkUser = await currentUser();

		const user = await findUserByClerkId(clerkId);

		if (!user) {
			const now = new Date();
			// User exists in Clerk but not in database - create them
			const newUser = await createUser({
				clerk_id: clerkId,
				email: clerkUser?.emailAddresses[0]?.emailAddress || "",
				first_name: clerkUser?.firstName || undefined,
				last_name: clerkUser?.lastName || undefined,
				image_url: clerkUser?.imageUrl || undefined,
				subscription: {
					user_id: clerkId,
					plan: "starter",
					status: "active",
					emails_processed: 0,
					emails_limit: 50,
					current_period_start: new Date(),
					current_period_end: new Date(
						Date.now() + 30 * 24 * 60 * 60 * 1000
					),
					created_at: now,
					updated_at: now,
					cancel_at_period_end: false,
				},
			});

			return NextResponse.json({
				authenticated: true,
				user: {
					id: newUser.id,
					clerkId: newUser.clerk_id,
					email: newUser.email,
					firstName: newUser.first_name,
					lastName: newUser.last_name,
					imageUrl: newUser.image_url,
					emailAccounts: newUser.email_accounts,
					subscription: newUser.subscription,
					voiceSettings: newUser.voice_settings,
				},
			});
		}

		return NextResponse.json({
			authenticated: true,
			user: {
				id: user.id,
				clerkId: user.clerk_id,
				email: user.email,
				firstName: user.first_name,
				lastName: user.last_name,
				imageUrl: user.image_url,
				emailAccounts: user.email_accounts,
				subscription: user.subscription,
				voiceSettings: user.voice_settings,
			},
		});
	} catch (error) {
		console.error("Error fetching auth status:", error);
		return NextResponse.json(
			{ error: "Failed to fetch authentication status" },
			{ status: 500 }
		);
	}
}
