import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const user = await currentUser();

	// Get or create user in database
	let dbUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		include: {
			emailAccounts: {
				where: { isActive: true },
			},
			subscription: true,
			voiceSettings: true,
		},
	});

	// Create user if doesn't exist
	if (!dbUser) {
		const now = new Date();
		dbUser = await prisma.user.create({
			data: {
				clerkId: userId,
				email: user?.emailAddresses[0]?.emailAddress || "",
				firstName: user?.firstName || null,
				lastName: user?.lastName || null,
				imageUrl: user?.imageUrl || null,
				subscription: {
					create: {
						plan: "starter",
						status: "active",
						emailsProcessed: 0,
						emailsLimit: 50,
						currentPeriodStart: now,
						currentPeriodEnd: new Date(
							now.getTime() + 30 * 24 * 60 * 60 * 1000
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
	}

	return <DashboardClient user={dbUser} />;
}
