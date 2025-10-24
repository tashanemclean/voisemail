import Link from "next/link";
import { Volume2, Shield, Lock, Eye, Database, Cookie } from "lucide-react";

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Navigation */}
			<nav className="container mx-auto px-4 py-6 border-b border-white/10">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center gap-3">
						<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
							<Volume2 className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-white">
							Voisemail
						</h1>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="text-purple-200 hover:text-white transition-colors"
						>
							Home
						</Link>
						<Link
							href="/sign-in"
							className="text-purple-200 hover:text-white transition-colors"
						>
							Sign In
						</Link>
					</div>
				</div>
			</nav>

			{/* Content */}
			<div className="container mx-auto px-4 py-12 max-w-4xl">
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/30 rounded-full mb-4">
							<Shield className="w-8 h-8 text-purple-300" />
						</div>
						<h1 className="text-4xl font-bold text-white mb-4">
							Privacy Policy
						</h1>
						<p className="text-purple-200">
							Last Updated: October 24, 2025
						</p>
					</div>

					{/* Introduction */}
					<div className="prose prose-invert max-w-none">
						<div className="mb-8">
							<p className="text-purple-100 leading-relaxed">
								At Voisemail, we take your privacy seriously.
								This Privacy Policy explains how we collect,
								use, disclose, and safeguard your information
								when you use our email assistant service. Please
								read this privacy policy carefully.
							</p>
						</div>

						{/* Section 1 */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<Database className="w-6 h-6 text-purple-400" />
								<h2 className="text-2xl font-bold text-white m-0">
									1. Information We Collect
								</h2>
							</div>
							<div className="text-purple-100 space-y-4">
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">
										Personal Information
									</h3>
									<p>
										When you create an account, we collect:
									</p>
									<ul className="list-disc list-inside ml-4 space-y-1">
										<li>Name and email address</li>
										<li>Profile information you provide</li>
										<li>
											Payment information (processed
											securely through third-party
											providers)
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-2">
										Email Data
									</h3>
									<p>
										When you connect your email account, we
										access:
									</p>
									<ul className="list-disc list-inside ml-4 space-y-1">
										<li>
											Email subject lines, sender
											information, and content
										</li>
										<li>
											Email metadata (date, time,
											recipients)
										</li>
										<li>
											Attachments (metadata only, not
											content)
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-2">
										Usage Information
									</h3>
									<ul className="list-disc list-inside ml-4 space-y-1">
										<li>Service usage statistics</li>
										<li>
											Feature interactions and preferences
										</li>
										<li>Device and browser information</li>
										<li>IP address and location data</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Section 2 */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<Eye className="w-6 h-6 text-purple-400" />
								<h2 className="text-2xl font-bold text-white m-0">
									2. How We Use Your Information
								</h2>
							</div>
							<div className="text-purple-100 space-y-2">
								<p>We use your information to:</p>
								<ul className="list-disc list-inside ml-4 space-y-1">
									<li>
										Provide and maintain our AI-powered
										email assistant service
									</li>
									<li>
										Generate audio summaries of your emails
									</li>
									<li>
										Analyze email content to provide
										insights (urgency, leads, job offers)
									</li>
									<li>Detect and filter spam/junk emails</li>
									<li>
										Improve our AI models and service
										quality
									</li>
									<li>
										Send service updates and notifications
									</li>
									<li>
										Process payments and manage
										subscriptions
									</li>
									<li>
										Respond to customer support inquiries
									</li>
									<li>Comply with legal obligations</li>
								</ul>
							</div>
						</div>

						{/* Section 3 */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<Lock className="w-6 h-6 text-purple-400" />
								<h2 className="text-2xl font-bold text-white m-0">
									3. Data Security
								</h2>
							</div>
							<div className="text-purple-100 space-y-4">
								<p>
									We implement industry-standard security
									measures:
								</p>
								<ul className="list-disc list-inside ml-4 space-y-1">
									<li>
										<strong>Encryption:</strong> All data is
										encrypted in transit (TLS/SSL) and at
										rest (AES-256)
									</li>
									<li>
										<strong>Access Controls:</strong> Strict
										access controls and authentication
										mechanisms
									</li>
									<li>
										<strong>Token Security:</strong> OAuth
										tokens are encrypted using AES-256-GCM
									</li>
									<li>
										<strong>Regular Audits:</strong>{" "}
										Security audits and vulnerability
										assessments
									</li>
									<li>
										<strong>Secure Infrastructure:</strong>{" "}
										Data stored on secure, compliant cloud
										infrastructure
									</li>
								</ul>
							</div>
						</div>

						{/* Section 4 */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<Shield className="w-6 h-6 text-purple-400" />
								<h2 className="text-2xl font-bold text-white m-0">
									4. Third-Party Services
								</h2>
							</div>
							<div className="text-purple-100 space-y-4">
								<p>
									We use the following third-party services:
								</p>
								<ul className="list-disc list-inside ml-4 space-y-2">
									<li>
										<strong>OpenAI:</strong> For AI-powered
										email analysis and insights
									</li>
									<li>
										<strong>ElevenLabs:</strong> For
										text-to-speech audio generation
									</li>
									<li>
										<strong>Google Gmail API:</strong> For
										accessing your Gmail account
									</li>
									<li>
										<strong>Clerk:</strong> For
										authentication and user management
									</li>
									<li>
										<strong>Payment Processors:</strong> For
										secure payment processing
									</li>
								</ul>
								<p className="mt-4">
									These services have their own privacy
									policies and security measures. We only
									share the minimum necessary information
									required to provide our service.
								</p>
							</div>
						</div>

						{/* Section 5 */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<Cookie className="w-6 h-6 text-purple-400" />
								<h2 className="text-2xl font-bold text-white m-0">
									5. Data Retention
								</h2>
							</div>
							<div className="text-purple-100 space-y-2">
								<ul className="list-disc list-inside ml-4 space-y-1">
									<li>
										Email metadata and summaries are
										retained while you have an active
										account
									</li>
									<li>
										Audio files are retained for 90 days or
										until deleted by you
									</li>
									<li>
										Account data is deleted within 30 days
										of account closure
									</li>
									<li>
										Anonymized usage data may be retained
										for analytics and service improvement
									</li>
								</ul>
							</div>
						</div>

						{/* Section 6 */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<Eye className="w-6 h-6 text-purple-400" />
								<h2 className="text-2xl font-bold text-white m-0">
									6. Your Rights
								</h2>
							</div>
							<div className="text-purple-100 space-y-2">
								<p>You have the right to:</p>
								<ul className="list-disc list-inside ml-4 space-y-1">
									<li>
										<strong>Access:</strong> Request a copy
										of your personal data
									</li>
									<li>
										<strong>Correction:</strong> Update or
										correct your information
									</li>
									<li>
										<strong>Deletion:</strong> Request
										deletion of your data
									</li>
									<li>
										<strong>Portability:</strong> Export
										your data in a common format
									</li>
									<li>
										<strong>Opt-out:</strong> Unsubscribe
										from marketing communications
									</li>
									<li>
										<strong>Revoke Access:</strong>{" "}
										Disconnect your email account at any
										time
									</li>
								</ul>
							</div>
						</div>

						{/* Section 7 */}
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-white mb-4">
								7. Children&apos;s Privacy
							</h2>
							<div className="text-purple-100">
								<p>
									Our service is not intended for children
									under 13. We do not knowingly collect
									personal information from children under 13.
									If you believe we have collected information
									from a child under 13, please contact us
									immediately.
								</p>
							</div>
						</div>

						{/* Section 8 */}
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-white mb-4">
								8. Changes to This Policy
							</h2>
							<div className="text-purple-100">
								<p>
									We may update this Privacy Policy from time
									to time. We will notify you of any changes
									by posting the new Privacy Policy on this
									page and updating the &quot;Last
									Updated&quot; date. Continued use of the
									service after changes constitutes acceptance
									of the updated policy.
								</p>
							</div>
						</div>

						{/* Section 9 */}
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-white mb-4">
								9. Contact Us
							</h2>
							<div className="text-purple-100">
								<p>
									If you have questions about this Privacy
									Policy, please contact us:
								</p>
								<div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
									<p>
										<strong>Email:</strong>{" "}
										privacy@voisemail.me
									</p>
									<p>
										<strong>Address:</strong> Voisemail
										Inc., 123 AI Street, San Francisco, CA
										94102
									</p>
									<p>
										<strong>Website:</strong>{" "}
										https://www.voisemail.me
									</p>
								</div>
							</div>
						</div>

						{/* GDPR & CCPA */}
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-white mb-4">
								10. GDPR & CCPA Compliance
							</h2>
							<div className="text-purple-100 space-y-4">
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">
										For EU Users (GDPR)
									</h3>
									<p>
										We comply with the General Data
										Protection Regulation (GDPR). You have
										the right to access, rectify, erase,
										restrict processing, object to
										processing, and data portability. To
										exercise these rights, contact us at
										privacy@voisemail.me.
									</p>
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">
										For California Users (CCPA)
									</h3>
									<p>
										California residents have the right to
										know what personal information is
										collected, request deletion, and opt-out
										of the sale of personal information. We
										do not sell personal information.
										Contact us at privacy@voisemail.me to
										exercise your rights.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-12 pt-8 border-t border-white/20 text-center">
						<p className="text-purple-300 mb-4">
							By using Voisemail, you agree to this Privacy
							Policy.
						</p>
						<Link
							href="/"
							className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
						>
							Back to Home
						</Link>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="container mx-auto px-4 py-8 border-t border-white/10 mt-12">
				<div className="text-center text-purple-300">
					<p>© 2025 Voisemail. All rights reserved.</p>
					<div className="mt-2 space-x-4">
						<Link
							href="/privacy"
							className="hover:text-white transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-white transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
