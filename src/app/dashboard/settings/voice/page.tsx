"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Settings, Save } from "lucide-react";

export default function VoiceSettingsPage() {
	const [voices, setVoices] = useState<
		{ id: string; name: string; description: string }[]
	>([]);
	const [selectedVoice, setSelectedVoice] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [playingVoice, setPlayingVoice] = useState<string | null>(null);
	const [settings, setSettings] = useState({
		stability: 0.6,
		similarityBoost: 0.8,
		style: 0.2,
		useSpeakerBoost: true,
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		loadVoices();
		loadUserSettings();
	}, []);

	const loadVoices = async () => {
		try {
			const response = await fetch("/api/voices");
			const data = await response.json();
			setVoices(data.voices || []);
		} catch (error) {
			console.error("Error loading voices:", error);
		}
	};

	const loadUserSettings = async () => {
		try {
			const response = await fetch("/api/settings/voice");
			const data = await response.json();

			if (data.voiceId) {
				setSelectedVoice({
					id: data.voiceId,
					name: data.voiceName,
				});
				setSettings({
					stability: data.stability,
					similarityBoost: data.similarityBoost,
					style: data.style,
					useSpeakerBoost: data.useSpeakerBoost,
				});
			}
		} catch (error) {
			console.error("Error loading settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const previewVoice = async (voiceId: string) => {
		if (playingVoice === voiceId) {
			setPlayingVoice(null);
			return;
		}

		try {
			setPlayingVoice(voiceId);

			const response = await fetch("/api/voices/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					voiceId,
					text: "Hello, this is a preview of how your emails will sound with this voice.",
					settings: {
						stability: settings.stability,
						similarity_boost: settings.similarityBoost,
						style: settings.style,
						use_speaker_boost: settings.useSpeakerBoost,
					},
				}),
			});

			const data = await response.json();

			if (data.audioUrl) {
				const audio = new Audio(data.audioUrl);
				audio.play();
				audio.onended = () => setPlayingVoice(null);
			}
		} catch (error) {
			console.error("Error previewing voice:", error);
			setPlayingVoice(null);
		}
	};

	const saveSettings = async () => {
		if (!selectedVoice) return;

		try {
			setSaving(true);

			await fetch("/api/settings/voice", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					voiceId: selectedVoice.id,
					voiceName: selectedVoice.name,
					modelId: "eleven_turbo_v2_5",
					stability: settings.stability,
					similarityBoost: settings.similarityBoost,
					style: settings.style,
					useSpeakerBoost: settings.useSpeakerBoost,
				}),
			});

			alert("Settings saved successfully!");
		} catch (error) {
			console.error("Error saving settings:", error);
			alert("Failed to save settings");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
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
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Voice Selection */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
					<h2 className="text-xl font-bold text-white mb-4">
						Select Voice
					</h2>
					<div className="space-y-3 max-h-96 overflow-y-auto">
						{voices.map((voice) => (
							<div
								key={voice.id}
								onClick={() => setSelectedVoice(voice)}
								className={`p-4 rounded-xl cursor-pointer transition-all ${
									selectedVoice?.id === voice.id
										? "bg-purple-600 border-2 border-purple-400"
										: "bg-white/5 border-2 border-white/10 hover:bg-white/10"
								}`}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h3 className="text-white font-semibold">
											{voice.name}
										</h3>
										<p className="text-purple-200 text-sm">
											{voice.description}
										</p>
									</div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											previewVoice(voice.id);
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

				{/* Settings Panel */}
				<div className="space-y-6">
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
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
										{settings.stability.toFixed(2)}
									</span>
								</div>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									value={settings.stability}
									onChange={(e) =>
										setSettings({
											...settings,
											stability: parseFloat(
												e.target.value
											),
										})
									}
									className="w-full"
								/>
								<p className="text-purple-300 text-xs mt-1">
									Higher = more consistent
								</p>
							</div>

							<div>
								<div className="flex justify-between mb-2">
									<label className="text-purple-200 text-sm font-medium">
										Similarity Boost
									</label>
									<span className="text-white text-sm">
										{settings.similarityBoost.toFixed(2)}
									</span>
								</div>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									value={settings.similarityBoost}
									onChange={(e) =>
										setSettings({
											...settings,
											similarityBoost: parseFloat(
												e.target.value
											),
										})
									}
									className="w-full"
								/>
								<p className="text-purple-300 text-xs mt-1">
									How close to original voice
								</p>
							</div>

							<div>
								<div className="flex justify-between mb-2">
									<label className="text-purple-200 text-sm font-medium">
										Style
									</label>
									<span className="text-white text-sm">
										{settings.style.toFixed(2)}
									</span>
								</div>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									value={settings.style}
									onChange={(e) =>
										setSettings({
											...settings,
											style: parseFloat(e.target.value),
										})
									}
									className="w-full"
								/>
								<p className="text-purple-300 text-xs mt-1">
									Amount of emotion
								</p>
							</div>
						</div>

						<button
							onClick={saveSettings}
							disabled={saving || !selectedVoice}
							className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
						>
							<Save className="w-5 h-5" />
							{saving ? "Saving..." : "Save Settings"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
