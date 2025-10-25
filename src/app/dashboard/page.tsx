import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findUserByClerkId, createUser } from "@/lib/db/users";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
	try {
		const { userId } = await auth();
		if (!userId) {
			redirect("/sign-in");
		}

		const clerkUser = await currentUser();
		let user = await findUserByClerkId(userId);

		if (!user) {
			user = await createUser({
				clerk_id: userId,
				email: clerkUser?.emailAddresses[0]?.emailAddress || "",
				first_name: clerkUser?.firstName || undefined,
				last_name: clerkUser?.lastName || undefined,
				image_url: clerkUser?.imageUrl || undefined,
			});
		}

		return <DashboardClient user={user} />;
	} catch (error) {
		console.error("Dashboard error:", error);
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center max-w-md">
					<h1 className="text-2xl font-bold text-white mb-4">
						Error Loading Dashboard
					</h1>
					<p className="text-purple-200 mb-4">
						Please try refreshing the page.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
					>
						Refresh Page
					</button>
				</div>
			</div>
		);
	}
}
