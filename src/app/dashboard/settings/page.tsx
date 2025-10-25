import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findUserByClerkId } from "@/lib/db/users";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
	const { userId } = await auth();
	if (!userId) {
		redirect("/sign-in");
	}

	const user = await findUserByClerkId(userId);

	if (!user) {
		redirect("/sign-in");
	}

	return <SettingsClient user={user} />;
}
