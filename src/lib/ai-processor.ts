import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { StorageService } from "./storage-service";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.ELEVENLABS_API_KEY,
});

interface EmailInsights {
	summary: string;
	urgencyLevel: "critical" | "high" | "medium" | "low";
	isLead: boolean;
	isJobOffer: boolean;
	insights: Array<{
		type: string;
		value: string;
		confidence: number;
	}>;
}

interface JunkAnalysis {
	isJunk: boolean;
	confidence: number;
	reason: string;
}

export class AIProcessor {
	private storageService: StorageService;

	constructor() {
		this.storageService = new StorageService();
	}

	async analyzeEmail(
		subject: string,
		from: string,
		body: string
	): Promise<EmailInsights> {
		const prompt = `Analyze this email and provide insights in JSON format:

Subject: ${subject}
From: ${from}
Body: ${body.substring(0, 3000)}

Provide a JSON response with:
1. summary (concise 1-2 sentence summary)
2. urgencyLevel (critical/high/medium/low based on deadlines, urgency keywords)
3. isLead (boolean - potential business opportunity, partnership, or new client)
4. isJobOffer (boolean - job opportunity, recruitment, career opportunity)
5. insights (array with type, value, confidence for each insight)

Return ONLY valid JSON.`;

		try {
			const completion = await openai.chat.completions.create({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content:
							"You are an expert email analyst. Return structured JSON only.",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: 0.3,
				response_format: { type: "json_object" },
			});

			const result = JSON.parse(
				completion.choices[0].message.content || "{}"
			);

			return {
				summary: result.summary || "Unable to generate summary",
				urgencyLevel: result.urgencyLevel || "low",
				isLead: result.isLead || false,
				isJobOffer: result.isJobOffer || false,
				insights: Array.isArray(result.insights) ? result.insights : [],
			};
		} catch (error) {
			console.error("Error analyzing email:", error);
			return {
				summary: "Unable to generate summary",
				urgencyLevel: "low",
				isLead: false,
				isJobOffer: false,
				insights: [],
			};
		}
	}

	async analyzeJunkEmail(
		subject: string,
		from: string,
		body: string
	): Promise<JunkAnalysis> {
		const prompt = `Analyze if this email is spam/junk:

Subject: ${subject}
From: ${from}
Body: ${body.substring(0, 2000)}

Return JSON with:
1. isJunk (boolean - true if spam/phishing/scam)
2. confidence (0-1 confidence score)
3. reason (brief explanation)

Look for: phishing attempts, scam indicators, suspicious domains, grammar issues.
Return ONLY valid JSON.`;

		try {
			const completion = await openai.chat.completions.create({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content:
							"You are a spam detection expert. Return structured JSON only.",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: 0.2,
				response_format: { type: "json_object" },
			});

			const result = JSON.parse(
				completion.choices[0].message.content || "{}"
			);

			return {
				isJunk: result.isJunk ?? true,
				confidence: result.confidence ?? 0.5,
				reason: result.reason || "Unable to determine",
			};
		} catch (error) {
			console.error("Error analyzing junk email:", error);
			return {
				isJunk: true,
				confidence: 0.5,
				reason: "Error during analysis",
			};
		}
	}

	async generateAudio(
		text: string,
		userId: string,
		emailId: string,
		voiceId: string = "21m00Tcm4TlvDq8ikWAM",
		modelId: string = "eleven_turbo_v2_5",
		settings?: {
			stability?: number;
			similarity_boost?: number;
			style?: number;
			use_speaker_boost?: boolean;
		}
	): Promise<string> {
		try {
			const voiceSettings = {
				stability: settings?.stability ?? 0.6,
				similarity_boost: settings?.similarity_boost ?? 0.8,
				style: settings?.style ?? 0.2,
				use_speaker_boost: settings?.use_speaker_boost ?? true,
			};

			const audio = await elevenlabs.textToSpeech.convert(voiceId, {
				text,
				model_id: modelId,
				voice_settings: voiceSettings,
			});

			const chunks: Uint8Array[] = [];
			for await (const chunk of audio) {
				chunks.push(chunk);
			}
			const buffer = Buffer.concat(chunks);

			const url = await this.storageService.saveAudioFile(
				buffer,
				userId,
				emailId
			);
			return url;
		} catch (error) {
			console.error("Error generating audio:", error);
			throw new Error("Failed to generate audio");
		}
	}

	async getAvailableVoices() {
		try {
			const voices = await elevenlabs.voices.getAll();
			return voices.voices.map((voice) => ({
				id: voice.voice_id,
				name: voice.name,
				category: voice.category,
				description: voice.description || "",
				labels: voice.labels || {},
			}));
		} catch (error) {
			console.error("Error fetching voices:", error);
			return [];
		}
	}
}
