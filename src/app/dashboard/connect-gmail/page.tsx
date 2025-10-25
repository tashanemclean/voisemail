"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Mail, CheckCircle } from "lucide-react";
import type { GmailTest } from "@/lib/types";

export default function ConnectGmailPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [configTest, setConfigTest] = useState<GmailTest | null>(null);

	useEffect(() => {
		// Test configuration on load
		fetch("/api/auth/gmail/test")
			.then((res) => res.json())
			.then((data) => setConfigTest(data))
			.catch((err) => console.error("Config test failed:", err));
	}, []);

	const handleConnectGmail = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/auth/gmail");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.error || "Failed to get authorization URL"
				);
			}

			if (data.authUrl) {
				window.location.href = data.authUrl;
			} else {
				throw new Error("No authorization URL returned");
			}
		} catch (err) {
			console.error("Error connecting Gmail:", err);
			setError(err instanceof Error ? err.message : "Unknown error");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
			<div className="container mx-auto max-w-2xl">
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
					<div className="text-center mb-8">
						<Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
						<h1 className="text-3xl font-bold text-white mb-2">
							Connect Gmail
						</h1>
						<p className="text-purple-200">
							Connect your Gmail account to start using Voisemail
						</p>
					</div>

					{/* Configuration Status */}
					{configTest && (
						<div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
							<h3 className="text-white font-semibold mb-2">
								Configuration Status
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2">
									{configTest.config?.allConfigured ? (
										<CheckCircle className="w-4 h-4 text-green-400" />
									) : (
										<AlertCircle className="w-4 h-4 text-yellow-400" />
									)}
									<span className="text-purple-200">
										{configTest.recommendation}
									</span>
								</div>
							</div>
						</div>
					)}

					{error && (
						<div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
							<div className="flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
								<div>
									<h4 className="text-white font-semibold mb-1">
										Connection Error
									</h4>
									<p className="text-red-200 text-sm">
										{error}
									</p>
									<p className="text-red-300 text-xs mt-2">
										Please check your Gmail OAuth
										configuration in .env.local
									</p>
								</div>
							</div>
						</div>
					)}

					<button
						onClick={handleConnectGmail}
						disabled={loading || !configTest?.config?.allConfigured}
						className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								Connecting...
							</>
						) : (
							<>
								<Mail className="w-5 h-5" />
								Connect Gmail Account
							</>
						)}
					</button>

					<div className="mt-6 text-center text-sm text-purple-300">
						<p>
							We&apos;ll never read, store, or share your emails
							without permission
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
