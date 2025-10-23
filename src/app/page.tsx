"use client";

import { useState } from "react";
import {
	Play,
	Pause,
	Check,
	Star,
	TrendingUp,
	Users,
	Zap,
	Shield,
	Mail,
	Volume2,
	Settings,
	ChevronRight,
} from "lucide-react";

// Mock voice data
const availableVoices = [
	{
		id: "21m00Tcm4TlvDq8ikWAM",
		name: "Rachel",
		gender: "Female",
		description: "Calm, professional",
		accent: "American",
	},
	{
		id: "pNInz6obpgDQGcFmaJgB",
		name: "Adam",
		gender: "Male",
		description: "Deep, authoritative",
		accent: "American",
	},
	{
		id: "EXAVITQu4vr4xnSDxMaL",
		name: "Bella",
		gender: "Female",
		description: "Friendly, engaging",
		accent: "American",
	},
	{
		id: "ErXwobaYiN019PkySvjV",
		name: "Antoni",
		gender: "Male",
		description: "Well-rounded",
		accent: "American",
	},
	{
		id: "MF3mGyEYCl7XYWbV9V6O",
		name: "Elli",
		gender: "Female",
		description: "Young, energetic",
		accent: "American",
	},
	{
		id: "TxGEqnHWrfWFTfGW9XjX",
		name: "Josh",
		gender: "Male",
		description: "Deep, young",
		accent: "American",
	},
];

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "CEO",
		company: "TechCorp",
		image: "SJ",
		content:
			"Voisemail has transformed how I manage my inbox. I can now listen to important emails during my commute and never miss critical updates.",
		rating: 5,
	},
	{
		name: "Michael Chen",
		role: "Product Manager",
		company: "InnovateLabs",
		image: "MC",
		content:
			"The AI-powered urgency detection is a game changer. It helps me prioritize what truly matters and respond faster to leads.",
		rating: 5,
	},
	{
		name: "Emily Rodriguez",
		role: "Freelance Consultant",
		company: "Self-Employed",
		image: "ER",
		content:
			"As a busy consultant, Voisemail helps me identify potential clients instantly. The lead detection feature has already helped me close 3 new deals!",
		rating: 5,
	},
	{
		name: "David Thompson",
		role: "VP of Sales",
		company: "SalesForce Pro",
		image: "DT",
		content:
			"Our entire sales team uses Voisemail. The job offer detection helped me find my current position, and now I use it to scout talent.",
		rating: 5,
	},
];

const companies = [
	{ name: "TechCorp", logo: "TC" },
	{ name: "InnovateLabs", logo: "IL" },
	{ name: "SalesForce Pro", logo: "SP" },
	{ name: "DataStream", logo: "DS" },
	{ name: "CloudNine", logo: "CN" },
	{ name: "NextGen AI", logo: "NA" },
];

const pricingPlans = [
	{
		name: "Starter",
		price: "0",
		period: "forever",
		description: "Perfect for individuals getting started",
		features: [
			"50 emails processed per month",
			"Basic AI insights",
			"Standard voice quality",
			"1 email account",
			"Email support",
		],
		cta: "Start Free",
		highlighted: false,
	},
	{
		name: "Professional",
		price: "29",
		period: "month",
		description: "Ideal for busy professionals",
		features: [
			"500 emails processed per month",
			"Advanced AI insights",
			"Premium voice quality",
			"3 email accounts",
			"Lead & job offer detection",
			"Priority email support",
			"Custom voice selection",
		],
		cta: "Start Free Trial",
		highlighted: true,
	},
	{
		name: "Business",
		price: "99",
		period: "month",
		description: "For teams and organizations",
		features: [
			"Unlimited emails processed",
			"Enterprise AI features",
			"Ultra HD voice quality",
			"Unlimited email accounts",
			"Advanced analytics dashboard",
			"Team collaboration tools",
			"24/7 priority support",
			"Custom integrations",
			"Dedicated account manager",
		],
		cta: "Contact Sales",
		highlighted: false,
	},
];

const VoisemailLanding = () => {
	const [currentPage, setCurrentPage] = useState("landing");
	const [selectedVoice, setSelectedVoice] = useState(availableVoices[0]);
	const [playingVoice, setPlayingVoice] = useState<string | null>(null);
	const [voiceSettings, setVoiceSettings] = useState({
		stability: 0.6,
		similarity_boost: 0.8,
		style: 0.2,
	});

	const handlePlayVoice = (voiceId: string) => {
		if (playingVoice === voiceId) {
			setPlayingVoice(null);
		} else {
			setPlayingVoice(voiceId);
			setTimeout(() => setPlayingVoice(null), 2000);
		}
	};

	const renderLandingPage = () => (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Navigation */}
			<nav className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
							<Volume2 className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-white">
							Voisemail
						</h1>
					</div>
					<div className="flex items-center gap-6">
						<button
							onClick={() => setCurrentPage("landing")}
							className="text-purple-200 hover:text-white transition-colors"
						>
							Home
						</button>
						<button
							onClick={() => setCurrentPage("pricing")}
							className="text-purple-200 hover:text-white transition-colors"
						>
							Pricing
						</button>
						<button className="text-purple-200 hover:text-white transition-colors">
							Sign In
						</button>
						<button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg transition-all">
							Get Started
						</button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-20 text-center">
				<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full mb-6 border border-white/20">
					<Zap className="w-4 h-4 text-yellow-400" />
					<span className="text-purple-200 text-sm">
						Trusted by 10,000+ professionals
					</span>
				</div>
				<h2 className="text-6xl font-bold text-white mb-6 max-w-4xl mx-auto">
					Your Inbox,{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
						Intelligently Spoken
					</span>
				</h2>
				<p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">
					Transform your email experience with AI-powered audio
					summaries, smart insights, and intelligent filtering. Save
					hours every week.
				</p>
				<div className="flex justify-center gap-4">
					<button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2">
						Start Free Trial
						<ChevronRight className="w-5 h-5" />
					</button>
					<button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all">
						Watch Demo
					</button>
				</div>
			</div>

			{/* Companies Using Voisemail */}
			<div className="container mx-auto px-4 py-12">
				<p className="text-center text-purple-300 mb-8">
					TRUSTED BY LEADING COMPANIES
				</p>
				<div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
					{companies.map((company, idx) => (
						<div
							key={idx}
							className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 flex items-center justify-center"
						>
							<div className="text-center">
								<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
									<span className="text-white font-bold text-sm">
										{company.logo}
									</span>
								</div>
								<p className="text-purple-200 text-xs font-semibold">
									{company.name}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Features Section */}
			<div className="container mx-auto px-4 py-20">
				<h3 className="text-4xl font-bold text-white text-center mb-16">
					Powerful Features
				</h3>
				<div className="grid md:grid-cols-3 gap-8">
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
						<div className="bg-purple-500/30 p-4 rounded-xl w-fit mb-4">
							<Volume2 className="w-8 h-8 text-purple-300" />
						</div>
						<h4 className="text-2xl font-bold text-white mb-3">
							Audio Summaries
						</h4>
						<p className="text-purple-200">
							Listen to AI-generated summaries while commuting,
							exercising, or multitasking. Never miss important
							information.
						</p>
					</div>

					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
						<div className="bg-pink-500/30 p-4 rounded-xl w-fit mb-4">
							<Zap className="w-8 h-8 text-pink-300" />
						</div>
						<h4 className="text-2xl font-bold text-white mb-3">
							Smart Insights
						</h4>
						<p className="text-purple-200">
							Automatically detect urgency levels, potential
							leads, job offers, and action items with advanced AI
							analysis.
						</p>
					</div>

					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
						<div className="bg-blue-500/30 p-4 rounded-xl w-fit mb-4">
							<Shield className="w-8 h-8 text-blue-300" />
						</div>
						<h4 className="text-2xl font-bold text-white mb-3">
							Junk Detection
						</h4>
						<p className="text-purple-200">
							AI-powered spam filtering with human oversight
							ensures you never miss legitimate messages hidden in
							junk.
						</p>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="container mx-auto px-4 py-20">
				<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12">
					<div className="grid md:grid-cols-3 gap-8 text-center">
						<div>
							<div className="flex items-center justify-center gap-2 mb-2">
								<TrendingUp className="w-8 h-8 text-white" />
								<p className="text-5xl font-bold text-white">
									73%
								</p>
							</div>
							<p className="text-purple-100">
								Time saved on email management
							</p>
						</div>
						<div>
							<div className="flex items-center justify-center gap-2 mb-2">
								<Users className="w-8 h-8 text-white" />
								<p className="text-5xl font-bold text-white">
									10K+
								</p>
							</div>
							<p className="text-purple-100">
								Active users worldwide
							</p>
						</div>
						<div>
							<div className="flex items-center justify-center gap-2 mb-2">
								<Mail className="w-8 h-8 text-white" />
								<p className="text-5xl font-bold text-white">
									2M+
								</p>
							</div>
							<p className="text-purple-100">
								Emails processed monthly
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials */}
			<div className="container mx-auto px-4 py-20">
				<h3 className="text-4xl font-bold text-white text-center mb-16">
					What Our Users Say
				</h3>
				<div className="grid md:grid-cols-2 gap-8">
					{testimonials.map((testimonial, idx) => (
						<div
							key={idx}
							className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
						>
							<div className="flex items-center gap-1 mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star
										key={i}
										className="w-5 h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<p className="text-purple-100 mb-6 italic">
								&quot;{testimonial.content}&quot;
							</p>
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
									<span className="text-white font-bold">
										{testimonial.image}
									</span>
								</div>
								<div>
									<p className="text-white font-semibold">
										{testimonial.name}
									</p>
									<p className="text-purple-300 text-sm">
										{testimonial.role} at{" "}
										{testimonial.company}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* CTA Section */}
			<div className="container mx-auto px-4 py-20">
				<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
					<h2 className="text-4xl font-bold text-white mb-4">
						Ready to Transform Your Inbox?
					</h2>
					<p className="text-xl text-purple-100 mb-8">
						Join thousands of professionals saving hours every week.
						Start free today.
					</p>
					<button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-all transform hover:scale-105">
						Start Free Trial
					</button>
					<p className="text-purple-100 text-sm mt-4">
						No credit card required • 14-day free trial
					</p>
				</div>
			</div>

			{/* Footer */}
			<footer className="container mx-auto px-4 py-8 border-t border-white/10">
				<div className="text-center text-purple-300">
					<p>© 2025 Voisemail. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);

	const renderPricingPage = () => (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{/* Navigation */}
			<nav className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
							<Volume2 className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-white">
							Voisemail
						</h1>
					</div>
					<div className="flex items-center gap-6">
						<button
							onClick={() => setCurrentPage("landing")}
							className="text-purple-200 hover:text-white transition-colors"
						>
							Home
						</button>
						<button
							onClick={() => setCurrentPage("pricing")}
							className="text-purple-200 hover:text-white transition-colors"
						>
							Pricing
						</button>
						<button className="text-purple-200 hover:text-white transition-colors">
							Sign In
						</button>
					</div>
				</div>
			</nav>

			{/* Pricing Header */}
			<div className="container mx-auto px-4 py-20 text-center">
				<h2 className="text-5xl font-bold text-white mb-6">
					Simple, Transparent Pricing
				</h2>
				<p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">
					Choose the plan that&apos;s right for you. All plans include
					a 14-day free trial.
				</p>
			</div>

			{/* Pricing Cards */}
			<div className="container mx-auto px-4 pb-20">
				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{pricingPlans.map((plan, idx) => (
						<div
							key={idx}
							className={`rounded-2xl p-8 border transition-all ${
								plan.highlighted
									? "bg-gradient-to-br from-purple-600 to-pink-600 border-white/20 transform scale-105 shadow-2xl"
									: "bg-white/10 backdrop-blur-lg border-white/20"
							}`}
						>
							{plan.highlighted && (
								<div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
									MOST POPULAR
								</div>
							)}
							<h3 className="text-2xl font-bold text-white mb-2">
								{plan.name}
							</h3>
							<p className="text-purple-200 text-sm mb-6">
								{plan.description}
							</p>
							<div className="mb-6">
								<span className="text-5xl font-bold text-white">
									${plan.price}
								</span>
								<span className="text-purple-200 ml-2">
									/{plan.period}
								</span>
							</div>
							<button
								className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
									plan.highlighted
										? "bg-white text-purple-600 hover:bg-purple-50"
										: "bg-purple-600 text-white hover:bg-purple-700"
								}`}
							>
								{plan.cta}
							</button>
							<div className="space-y-3">
								{plan.features.map((feature, i) => (
									<div
										key={i}
										className="flex items-center gap-3"
									>
										<Check className="w-5 h-5 text-green-400 flex-shrink-0" />
										<span className="text-purple-100 text-sm">
											{feature}
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* FAQ Section */}
			<div className="container mx-auto px-4 py-20">
				<h3 className="text-3xl font-bold text-white text-center mb-12">
					Frequently Asked Questions
				</h3>
				<div className="max-w-3xl mx-auto space-y-6">
					<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
						<h4 className="text-white font-semibold mb-2">
							Can I change plans later?
						</h4>
						<p className="text-purple-200 text-sm">
							Yes! You can upgrade or downgrade your plan at any
							time. Changes take effect immediately.
						</p>
					</div>
					<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
						<h4 className="text-white font-semibold mb-2">
							What payment methods do you accept?
						</h4>
						<p className="text-purple-200 text-sm">
							We accept all major credit cards, PayPal, and wire
							transfers for enterprise customers.
						</p>
					</div>
					<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
						<h4 className="text-white font-semibold mb-2">
							Is my data secure?
						</h4>
						<p className="text-purple-200 text-sm">
							Absolutely. We use enterprise-grade encryption and
							never store your email passwords. All data is
							encrypted at rest and in transit.
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	const renderVoiceSettings = () => (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
			<div className="container mx-auto max-w-6xl">
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Settings className="w-8 h-8 text-purple-400" />
							<div>
								<h1 className="text-2xl font-bold text-white">
									Voice Settings
								</h1>
								<p className="text-purple-200">
									Customize your audio experience
								</p>
							</div>
						</div>
						<button
							onClick={() => setCurrentPage("landing")}
							className="text-purple-200 hover:text-white transition-colors"
						>
							Back to Home
						</button>
					</div>
				</div>

				<div className="grid lg:grid-cols-2 gap-6">
					{/* Voice Selection */}
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
						<h2 className="text-xl font-bold text-white mb-4">
							Select Voice
						</h2>
						<div className="space-y-3">
							{availableVoices.map((voice) => (
								<div
									key={voice.id}
									onClick={() => setSelectedVoice(voice)}
									className={`p-4 rounded-xl cursor-pointer transition-all ${
										selectedVoice.id === voice.id
											? "bg-purple-600 border-2 border-purple-400"
											: "bg-white/5 border-2 border-white/10 hover:bg-white/10"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-white font-semibold">
													{voice.name}
												</h3>
												<span className="text-xs px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-full">
													{voice.gender}
												</span>
											</div>
											<p className="text-purple-200 text-sm">
												{voice.description}
											</p>
											<p className="text-purple-300 text-xs mt-1">
												{voice.accent} accent
											</p>
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handlePlayVoice(voice.id);
											}}
											className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full transition-all"
										>
											{playingVoice === voice.id ? (
												<Pause className="w-4 h-4" />
											) : (
												<Play className="w-4 h-4" />
											)}
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Voice Settings */}
					<div className="space-y-6">
						<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
							<h2 className="text-xl font-bold text-white mb-4">
								Voice Parameters
							</h2>

							<div className="space-y-6">
								<div>
									<div className="flex justify-between mb-2">
										<label className="text-purple-200 text-sm font-medium">
											Stability
										</label>
										<span className="text-white text-sm">
											{voiceSettings.stability.toFixed(2)}
										</span>
									</div>
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={voiceSettings.stability}
										onChange={(e) =>
											setVoiceSettings({
												...voiceSettings,
												stability: parseFloat(
													e.target.value
												),
											})
										}
										className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
									/>
									<p className="text-purple-300 text-xs mt-1">
										Higher = more consistent, Lower = more
										expressive
									</p>
								</div>

								<div>
									<div className="flex justify-between mb-2">
										<label className="text-purple-200 text-sm font-medium">
											Similarity Boost
										</label>
										<span className="text-white text-sm">
											{voiceSettings.similarity_boost.toFixed(
												2
											)}
										</span>
									</div>
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={voiceSettings.similarity_boost}
										onChange={(e) =>
											setVoiceSettings({
												...voiceSettings,
												similarity_boost: parseFloat(
													e.target.value
												),
											})
										}
										className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
									/>
									<p className="text-purple-300 text-xs mt-1">
										How close to the original voice
									</p>
								</div>

								<div>
									<div className="flex justify-between mb-2">
										<label className="text-purple-200 text-sm font-medium">
											Style
										</label>
										<span className="text-white text-sm">
											{voiceSettings.style.toFixed(2)}
										</span>
									</div>
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={voiceSettings.style}
										onChange={(e) =>
											setVoiceSettings({
												...voiceSettings,
												style: parseFloat(
													e.target.value
												),
											})
										}
										className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
									/>
									<p className="text-purple-300 text-xs mt-1">
										Amount of emotion and style
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
							<h2 className="text-xl font-bold text-white mb-4">
								Current Selection
							</h2>
							<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4">
								<h3 className="text-white font-bold text-lg mb-2">
									{selectedVoice.name}
								</h3>
								<p className="text-purple-100 text-sm mb-3">
									{selectedVoice.description} •{" "}
									{selectedVoice.accent}
								</p>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div className="bg-white/20 rounded p-2 text-center">
										<p className="text-purple-100">
											Stability
										</p>
										<p className="text-white font-bold">
											{voiceSettings.stability.toFixed(2)}
										</p>
									</div>
									<div className="bg-white/20 rounded p-2 text-center">
										<p className="text-purple-100">
											Similarity
										</p>
										<p className="text-white font-bold">
											{voiceSettings.similarity_boost.toFixed(
												2
											)}
										</p>
									</div>
									<div className="bg-white/20 rounded p-2 text-center">
										<p className="text-purple-100">Style</p>
										<p className="text-white font-bold">
											{voiceSettings.style.toFixed(2)}
										</p>
									</div>
								</div>
							</div>
							<button className="w-full mt-4 bg-white text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-lg font-semibold transition-all">
								Save Settings
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div>
			{currentPage === "landing" && renderLandingPage()}
			{currentPage === "pricing" && renderPricingPage()}
			{currentPage === "voice-settings" && renderVoiceSettings()}

			{/* Floating Action Button */}
			<div className="fixed bottom-6 right-6 flex flex-col gap-3">
				<button
					onClick={() => setCurrentPage("voice-settings")}
					className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
					title="Voice Settings"
				>
					<Settings className="w-6 h-6" />
				</button>
			</div>
		</div>
	);
};

export default function Home() {
	return <VoisemailLanding />;
}
