"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
	Mail,
	TrendingUp,
	AlertCircle,
	Briefcase,
	DollarSign,
	Volume2,
	Settings,
	RefreshCw,
	CheckCircle,
	XCircle,
	Plus,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Stats, User } from "@/lib/types";

export default function DashboardClient({ user }: { user: User }) {
	const searchParams = useSearchParams();
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);
	const [syncing, setSyncing] = useState(false);

	// Check for connection success
	const connected = searchParams?.get("connected");
	const connectedEmail = searchParams?.get("email");
	const error = searchParams?.get("error");

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			const response = await fetch("/api/stats");
			const data = await response.json();
			setStats(data);
		} catch (error) {
			console.error("Error loading stats:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSyncEmails = async () => {
		setSyncing(true);
		try {
			const response = await fetch("/api/emails/sync", {
				method: "POST",
			});
			const data = await response.json();

			if (data.success) {
				await loadStats();
				alert(`Synced ${data.syncedCount} new emails!`);
			}
		} catch (error) {
			console.error("Error syncing emails:", error);
			alert("Failed to sync emails");
		} finally {
			setSyncing(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Header */}
			<div className="container mx-auto px-4 py-6">
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
								<Volume2 className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-white">
									Dashboard
								</h1>
								<p className="text-purple-200">
									Welcome back, {user.firstName || user.email}
									!
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<Link
								href="/dashboard/settings"
								className="text-purple-200 hover:text-white transition-colors"
							>
								<Settings className="w-6 h-6" />
							</Link>
							<UserButton afterSignOutUrl="/" />
						</div>
					</div>
				</div>
			</div>

			{/* Alerts */}
			<div className="container mx-auto px-4">
				{connected === "gmail" && connectedEmail && (
					<div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
						<CheckCircle className="w-5 h-5 text-green-400" />
						<p className="text-green-100">
							Gmail account connected successfully:{" "}
							{connectedEmail}
						</p>
					</div>
				)}

				{error && (
					<div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
						<XCircle className="w-5 h-5 text-red-400" />
						<p className="text-red-100">
							Error: {error.replace(/_/g, " ")}
						</p>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 pb-12">
				{user.emailAccounts.length === 0 ? (
					// No email accounts connected
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-white/20">
						<Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-white mb-4">
							Connect Your Email Account
						</h2>
						<p className="text-purple-200 mb-8 max-w-md mx-auto">
							Get started by connecting your Gmail account to
							begin using Voisemail&apos;s AI-powered features.
						</p>
						<Link
							href="/dashboard/connect-gmail"
							className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
						>
							<Plus className="w-5 h-5" />
							Connect Gmail
						</Link>
					</div>
				) : (
					<>
						{/* Stats Grid */}
						<div className="grid md:grid-cols-4 gap-6 mb-8">
							<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
								<div className="flex items-center justify-between mb-2">
									<Mail className="w-8 h-8 text-purple-400" />
									<TrendingUp className="w-5 h-5 text-green-400" />
								</div>
								<h3 className="text-2xl font-bold text-white">
									{loading ? "..." : stats?.totalEmails || 0}
								</h3>
								<p className="text-purple-200 text-sm">
									Total Emails
								</p>
							</div>

							<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
								<div className="flex items-center justify-between mb-2">
									<AlertCircle className="w-8 h-8 text-red-400" />
								</div>
								<h3 className="text-2xl font-bold text-white">
									{loading
										? "..."
										: stats?.criticalEmails || 0}
								</h3>
								<p className="text-purple-200 text-sm">
									Critical
								</p>
							</div>

							<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
								<div className="flex items-center justify-between mb-2">
									<DollarSign className="w-8 h-8 text-blue-400" />
								</div>
								<h3 className="text-2xl font-bold text-white">
									{loading ? "..." : stats?.leads || 0}
								</h3>
								<p className="text-purple-200 text-sm">Leads</p>
							</div>

							<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
								<div className="flex items-center justify-between mb-2">
									<Briefcase className="w-8 h-8 text-green-400" />
								</div>
								<h3 className="text-2xl font-bold text-white">
									{loading ? "..." : stats?.jobOffers || 0}
								</h3>
								<p className="text-purple-200 text-sm">
									Job Offers
								</p>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="grid md:grid-cols-3 gap-6">
							<Link
								href="/dashboard/emails"
								className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
							>
								<Mail className="w-8 h-8 text-purple-400 mb-3" />
								<h3 className="text-xl font-bold text-white mb-2">
									View Emails
								</h3>
								<p className="text-purple-200 text-sm">
									Browse and listen to your processed emails
								</p>
							</Link>

							<button
								onClick={handleSyncEmails}
								disabled={syncing}
								className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all text-left disabled:opacity-50"
							>
								<RefreshCw
									className={`w-8 h-8 text-purple-400 mb-3 ${
										syncing ? "animate-spin" : ""
									}`}
								/>
								<h3 className="text-xl font-bold text-white mb-2">
									{syncing ? "Syncing..." : "Sync Emails"}
								</h3>
								<p className="text-purple-200 text-sm">
									Fetch new emails from your accounts
								</p>
							</button>

							<Link
								href="/dashboard/settings/voice"
								className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
							>
								<Settings className="w-8 h-8 text-purple-400 mb-3" />
								<h3 className="text-xl font-bold text-white mb-2">
									Voice Settings
								</h3>
								<p className="text-purple-200 text-sm">
									Customize your audio preferences
								</p>
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
