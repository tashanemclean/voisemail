import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
				{/* Left Side - Branding */}
				<div className="flex-1 text-center lg:text-left">
					<div className="inline-flex items-center gap-3 mb-6">
						<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl">
							<svg
								className="w-12 h-12 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
								/>
							</svg>
						</div>
						<h1 className="text-5xl font-bold text-white">
							Voisemail
						</h1>
					</div>

					<p className="text-2xl text-purple-200 mb-8 max-w-lg">
						Transform your inbox into intelligent audio insights
					</p>

					<div className="space-y-6 max-w-lg">
						<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
							<div className="flex items-start gap-4">
								<div className="bg-purple-500/30 p-3 rounded-lg">
									<svg
										className="w-6 h-6 text-purple-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-white font-semibold mb-1">
										Audio Summaries
									</h3>
									<p className="text-purple-200 text-sm">
										Listen to AI-generated summaries of your
										emails
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
							<div className="flex items-start gap-4">
								<div className="bg-pink-500/30 p-3 rounded-lg">
									<svg
										className="w-6 h-6 text-pink-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-white font-semibold mb-1">
										Smart Insights
									</h3>
									<p className="text-purple-200 text-sm">
										Detect urgency, leads, and job offers
										automatically
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
							<div className="flex items-start gap-4">
								<div className="bg-blue-500/30 p-3 rounded-lg">
									<svg
										className="w-6 h-6 text-blue-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-white font-semibold mb-1">
										Junk Detection
									</h3>
									<p className="text-purple-200 text-sm">
										AI-powered spam filtering with human
										oversight
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Sign In Form */}
				<div className="flex-shrink-0">
					<div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
						<div className="mb-6 text-center">
							<h2 className="text-2xl font-bold text-white mb-2">
								Welcome Back
							</h2>
							<p className="text-purple-200">
								Sign in to access your intelligent inbox
							</p>
						</div>
						<SignIn
							appearance={{
								elements: {
									rootBox: "w-full",
									card: "bg-transparent shadow-none",
									headerTitle: "hidden",
									headerSubtitle: "hidden",
									socialButtonsBlockButton:
										"bg-white/10 border-white/20 text-white hover:bg-white/20",
									socialButtonsBlockButtonText: "text-white",
									dividerLine: "bg-white/20",
									dividerText: "text-purple-200",
									formButtonPrimary:
										"bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
									formFieldInput:
										"bg-white/10 border-white/20 text-white placeholder:text-purple-300",
									formFieldLabel: "text-purple-200",
									footerActionLink:
										"text-purple-300 hover:text-purple-200",
									identityPreviewText: "text-white",
									identityPreviewEditButton:
										"text-purple-300",
									formFieldInputShowPasswordButton:
										"text-purple-300",
									otpCodeFieldInput:
										"bg-white/10 border-white/20 text-white",
									formResendCodeLink:
										"text-purple-300 hover:text-purple-200",
									footer: "hidden",
								},
							}}
							routing="path"
							path="/sign-in"
							signUpUrl="/sign-up"
						/>
						<div className="mt-6 text-center">
							<p className="text-purple-200 text-sm">
								Don&apos;t have an account?{" "}
								<Link
									href="/sign-up"
									className="text-purple-300 hover:text-purple-200 font-semibold underline"
								>
									Sign up for free
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
