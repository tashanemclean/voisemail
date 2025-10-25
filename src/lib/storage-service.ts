import { supabase } from "./db/supabase";

export class StorageService {
	private bucketName = "email-audio";

	constructor() {
		// No filesystem operations needed
	}

	/**
	 * Save audio file to Supabase Storage and create database record
	 */
	async saveAudioFile(
		buffer: Buffer,
		userId: string,
		emailId?: string
	): Promise<string> {
		try {
			const filename = `${userId}-${Date.now()}.mp3`;
			const filepath = `${userId}/${filename}`;

			// Upload to Supabase Storage
			const { data, error } = await supabase.storage
				.from(this.bucketName)
				.upload(filepath, buffer, {
					contentType: "audio/mpeg",
					cacheControl: "3600",
					upsert: false,
				});

			if (error) {
				console.error("Supabase storage upload error:", error);
				throw error;
			}

			// Get public URL
			const { data: urlData } = supabase.storage
				.from(this.bucketName)
				.getPublicUrl(filepath);

			const publicUrl = urlData.publicUrl;

			// Create database record
			await supabase.from("audio_files").insert({
				user_id: userId,
				email_id: emailId,
				filename,
				url: publicUrl,
				size: buffer.length,
				mime_type: "audio/mpeg",
			});

			return publicUrl;
		} catch (error) {
			console.error("Error saving audio file:", error);
			throw new Error("Failed to save audio file");
		}
	}

	/**
	 * Delete audio file from Supabase Storage
	 */
	async deleteAudioFile(url: string): Promise<void> {
		try {
			// Extract filepath from URL
			const urlObj = new URL(url);
			const filepath = urlObj.pathname.split(`/${this.bucketName}/`)[1];

			if (!filepath) {
				throw new Error("Invalid audio file URL");
			}

			// Delete from Supabase Storage
			const { error } = await supabase.storage
				.from(this.bucketName)
				.remove([filepath]);

			if (error) {
				console.error("Supabase storage delete error:", error);
				throw error;
			}

			// Delete database record
			await supabase.from("audio_files").delete().eq("url", url);
		} catch (error) {
			console.error("Error deleting audio file:", error);
			throw new Error("Failed to delete audio file");
		}
	}

	/**
	 * Get audio file info from database
	 */
	async getAudioFile(url: string) {
		const { data, error } = await supabase
			.from("audio_files")
			.select("*")
			.eq("url", url)
			.single();

		if (error && error.code !== "PGRST116") {
			throw error;
		}

		return data;
	}

	/**
	 * List audio files for a user
	 */
	async listAudioFiles(userId: string) {
		const { data, error } = await supabase
			.from("audio_files")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data || [];
	}
}
