"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Mail,
	Trash2,
	AlertCircle,
	CheckCircle,
	Plus,
	Settings,
	Volume2,
	User,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { User as DbUser } from "@/lib/types";

export default function SettingsClient({ user }: { user: DbUser }) {
	const [accounts, setAccounts] = useState(user.email_accounts);
	const [disconnecting, setDisconnecting] = useState<string | null>(null);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleDisconnect = async (accountId: string, email: string) => {
		if (
			!confirm(
				`Are you sure you want to disconnect ${email}? All associated emails will be deleted.`
			)
		) {
			return;
		}

		setDisconnecting(accountId);
		setMessage(null);

		try {
			const response = await fetch("/api/accounts/disconnect", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ accountId }),
			});

			const data = await response.json();

			if (response.ok) {
				setAccounts(accounts?.filter((acc) => acc.id !== accountId));
				setMessage({
					type: "success",
					text: `Successfully disconnected ${email}`,
				});
			} else {
				setMessage({
					type: "error",
					text: data.error || "Failed to disconnect account",
				});
			}
		} catch (error) {
			console.error("Error disconnecting account:", error);
			setMessage({
				type: "error",
				text: "An error occurred while disconnecting the account",
			});
		} finally {
			setDisconnecting(null);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Header */}
			<div className="container mx-auto px-4 py-6">
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Settings className="w-8 h-8 text-purple-400" />
							<div>
								<h1 className="text-3xl font-bold text-white">
									Settings
								</h1>
								<p className="text-purple-200">
									Manage your account preferences
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<Link
								href="/dashboard"
								className="text-purple-200 hover:text-white transition-colors"
							>
								Dashboard
							</Link>
							<UserButton afterSignOutUrl="/" />
						</div>
					</div>
				</div>
			</div>

			{/* Alert Messages */}
			{message && (
				<div className="container mx-auto px-4">
					<div
						className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
							message.type === "success"
								? "bg-green-500/20 border border-green-500/50"
								: "bg-red-500/20 border border-red-500/50"
						}`}
					>
						{message.type === "success" ? (
							<CheckCircle className="w-5 h-5 text-green-400" />
						) : (
							<AlertCircle className="w-5 h-5 text-red-400" />
						)}
						<p
							className={
								message.type === "success"
									? "text-green-100"
									: "text-red-100"
							}
						>
							{message.text}
						</p>
					</div>
				</div>
			)}

			{/* Content */}
			<div className="container mx-auto px-4 pb-12">
				<div className="grid md:grid-cols-3 gap-6">
					{/* Sidebar */}
					<div className="space-y-4">
						<Link
							href="/dashboard/settings"
							className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center gap-3 hover:bg-white/15 transition-all"
						>
							<Mail className="w-5 h-5 text-purple-400" />
							<span className="text-white font-medium">
								Email Accounts
							</span>
						</Link>
						<Link
							href="/dashboard/settings/voice"
							className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all"
						>
							<Volume2 className="w-5 h-5 text-purple-300" />
							<span className="text-purple-200 font-medium">
								Voice Settings
							</span>
						</Link>
						<Link
							href="/dashboard/settings/profile"
							className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all"
						>
							<User className="w-5 h-5 text-purple-300" />
							<span className="text-purple-200 font-medium">
								Profile
							</span>
						</Link>
					</div>

					{/* Main Content */}
					<div className="md:col-span-2 space-y-6">
						{/* Email Accounts Section */}
						<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
							<div className="flex items-center justify-between mb-6">
								<div>
									<h2 className="text-2xl font-bold text-white mb-2">
										Connected Email Accounts
									</h2>
									<p className="text-purple-200 text-sm">
										Manage your connected email accounts
									</p>
								</div>
								<Link
									href="/dashboard/connect-gmail"
									className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all"
								>
									<Plus className="w-4 h-4" />
									Add Account
								</Link>
							</div>

							{accounts.length === 0 ? (
								<div className="text-center py-12">
									<Mail className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
									<p className="text-purple-200 mb-4">
										No email accounts connected
									</p>
									<Link
										href="/dashboard/connect-gmail"
										className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all"
									>
										<Plus className="w-4 h-4" />
										Connect Gmail
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{accounts.map((account) => (
										<div
											key={account.id}
											className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
										>
											<div className="flex items-center gap-4">
												<div className="bg-purple-500/30 p-3 rounded-lg">
													<Mail className="w-6 h-6 text-purple-300" />
												</div>
												<div>
													<h3 className="text-white font-semibold">
														{account.email}
													</h3>
													<p className="text-purple-300 text-sm capitalize">
														{account.provider}
													</p>
													<p className="text-purple-400 text-xs mt-1">
														Connected{" "}
														{new Date(
															account.createdAt
														).toLocaleDateString()}
													</p>
												</div>
											</div>
											<button
												onClick={() =>
													handleDisconnect(
														account.id,
														account.email
													)
												}
												disabled={
													disconnecting === account.id
												}
												className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
											>
												{disconnecting ===
												account.id ? (
													<>
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-300"></div>
														Disconnecting...
													</>
												) : (
													<>
														<Trash2 className="w-4 h-4" />
														Disconnect
													</>
												)}
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Subscription Info */}
						{user.subscription && (
							<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
								<h2 className="text-2xl font-bold text-white mb-4">
									Subscription
								</h2>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-purple-200">
											Plan
										</span>
										<span className="text-white font-semibold capitalize">
											{user.subscription.plan}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-purple-200">
											Status
										</span>
										<span className="text-green-400 font-semibold capitalize">
											{user.subscription.status}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-purple-200">
											Emails Processed
										</span>
										<span className="text-white font-semibold">
											{user.subscription.emailsProcessed}{" "}
											/ {user.subscription.emailsLimit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-purple-200">
											Period Ends
										</span>
										<span className="text-white font-semibold">
											{new Date(
												user.subscription.currentPeriodEnd
											).toLocaleDateString()}
										</span>
									</div>
								</div>
								<Link
									href="/pricing"
									className="mt-4 block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all"
								>
									Upgrade Plan
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
