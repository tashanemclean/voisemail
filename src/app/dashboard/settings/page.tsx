import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const user = await prisma.user.findUnique({
		where: { clerkId: userId },
		include: {
			emailAccounts: {
				where: { isActive: true },
			},
			subscription: true,
			voiceSettings: true,
		},
	});

	if (!user) {
		redirect("/sign-in");
	}

	return <SettingsClient user={user} />;
}
