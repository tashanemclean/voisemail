import { supabase } from "./supabase";
import type { VoiceSettings } from "../types";

export async function getVoiceSettings(userId: string) {
	const { data, error } = await supabase
		.from("voice_settings")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	return data;
}

export async function createOrUpdateVoiceSettings(settings: {
	userId: string;
	voiceId: string;
	voiceName: string;
	modelId: string;
	stability: number;
	similarityBoost: number;
	style: number;
	useSpeakerBoost: boolean;
}) {
	const { data: existing } = await supabase
		.from("voice_settings")
		.select("id")
		.eq("user_id", settings.userId)
		.single();

	if (existing) {
		const { data, error } = await supabase
			.from("voice_settings")
			.update({
				voice_id: settings.voiceId,
				voice_name: settings.voiceName,
				model_id: settings.modelId,
				stability: settings.stability,
				similarity_boost: settings.similarityBoost,
				style: settings.style,
				use_speaker_boost: settings.useSpeakerBoost,
				updated_at: new Date().toISOString(),
			})
			.eq("id", existing.id)
			.select()
			.single();

		if (error) throw error;
		return data;
	} else {
		const { data, error } = await supabase
			.from("voice_settings")
			.insert({
				user_id: settings.userId,
				voice_id: settings.voiceId,
				voice_name: settings.voiceName,
				model_id: settings.modelId,
				stability: settings.stability,
				similarity_boost: settings.similarityBoost,
				style: settings.style,
				use_speaker_boost: settings.useSpeakerBoost,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}
