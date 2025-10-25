import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
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
						Your AI-powered email assistant starts here
					</p>

					<div className="space-y-4 max-w-lg">
						<div className="flex items-center gap-3 text-purple-200">
							<div className="bg-green-500 rounded-full p-1">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span className="text-lg">
								Listen to email summaries on-the-go
							</span>
						</div>

						<div className="flex items-center gap-3 text-purple-200">
							<div className="bg-green-500 rounded-full p-1">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span className="text-lg">
								Never miss urgent emails again
							</span>
						</div>

						<div className="flex items-center gap-3 text-purple-200">
							<div className="bg-green-500 rounded-full p-1">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span className="text-lg">
								Identify leads and opportunities instantly
							</span>
						</div>

						<div className="flex items-center gap-3 text-purple-200">
							<div className="bg-green-500 rounded-full p-1">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span className="text-lg">
								Smart junk filtering with AI
							</span>
						</div>
					</div>

					<div className="mt-12 p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
						<p className="text-purple-200 italic">
							&quot;Voisemail has transformed how I manage my
							inbox. I can now listen to important emails during
							my commute!&quot;
						</p>
						<div className="flex items-center gap-3 mt-4">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
							<div>
								<p className="text-white font-semibold">
									Sarah Johnson
								</p>
								<p className="text-purple-300 text-sm">
									Product Manager
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Sign Up Form */}
				<div className="flex-shrink-0">
					<div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
						<div className="mb-6 text-center">
							<h2 className="text-2xl font-bold text-white mb-2">
								Create Your Account
							</h2>
							<p className="text-purple-200">
								Start your free trial today
							</p>
						</div>
						<SignUp
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
							path="/sign-up"
							signInUrl="/sign-in"
						/>
						<div className="mt-6 text-center">
							<p className="text-purple-200 text-sm">
								Already have an account?{" "}
								<Link
									href="/sign-in"
									className="text-purple-300 hover:text-purple-200 font-semibold underline"
								>
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
