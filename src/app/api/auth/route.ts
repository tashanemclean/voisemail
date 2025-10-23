import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

		const dbUser = await prisma.user.findUnique({
			where: { clerkId },
			include: {
				emailAccounts: {
					select: {
						id: true,
						provider: true,
						email: true,
						isActive: true,
						createdAt: true,
					},
				},
				subscription: {
					select: {
						plan: true,
						status: true,
						emailsProcessed: true,
						emailsLimit: true,
						currentPeriodEnd: true,
					},
				},
				voiceSettings: {
					select: {
						voiceId: true,
						voiceName: true,
					},
				},
			},
		});

		if (!dbUser) {
			// User exists in Clerk but not in database - create them
			const newUser = await prisma.user.create({
				data: {
					clerkId,
					email: clerkUser?.emailAddresses[0]?.emailAddress || "",
					firstName: clerkUser?.firstName || null,
					lastName: clerkUser?.lastName || null,
					imageUrl: clerkUser?.imageUrl || null,
					subscription: {
						create: {
							plan: "starter",
							status: "active",
							emailsProcessed: 0,
							emailsLimit: 50,
							currentPeriodStart: new Date(),
							currentPeriodEnd: new Date(
								Date.now() + 30 * 24 * 60 * 60 * 1000
							),
						},
					},
				},
				include: {
					emailAccounts: true,
					subscription: true,
					voiceSettings: true,
				},
			});

			return NextResponse.json({
				authenticated: true,
				user: {
					id: newUser.id,
					clerkId: newUser.clerkId,
					email: newUser.email,
					firstName: newUser.firstName,
					lastName: newUser.lastName,
					imageUrl: newUser.imageUrl,
					emailAccounts: newUser.emailAccounts,
					subscription: newUser.subscription,
					voiceSettings: newUser.voiceSettings,
				},
			});
		}

		return NextResponse.json({
			authenticated: true,
			user: {
				id: dbUser.id,
				clerkId: dbUser.clerkId,
				email: dbUser.email,
				firstName: dbUser.firstName,
				lastName: dbUser.lastName,
				imageUrl: dbUser.imageUrl,
				emailAccounts: dbUser.emailAccounts,
				subscription: dbUser.subscription,
				voiceSettings: dbUser.voiceSettings,
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
