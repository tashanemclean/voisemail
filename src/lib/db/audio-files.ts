import { supabase } from "./supabase";
import type { AudioFile } from "../types";

/**
 * Creates a new audio file record in the database.
 * NOTE: This function handles the database entry. The actual audio file MUST be
 * uploaded to Supabase Storage (or equivalent) separately BEFORE calling this function.
 *
 * @param data The minimum required data for an audio file record.
 * @returns The newly created AudioFile object.
 */
export async function createAudioFile(
	data: Omit<AudioFile, "id" | "createdAt" | "mimeType"> & {
		mimeType?: string;
	}
): Promise<AudioFile> {
	const { data: audioFile, error } = await supabase
		.from("audio_files")
		.insert({
			user_id: data.userId,
			email_id: data.emailId, // Nullable
			filename: data.filename,
			url: data.url,
			duration: data.duration, // Nullable
			size: data.size,
			mime_type: data.mimeType, // Will use DB default 'audio/mpeg' if undefined
		})
		.select()
		.single();

	if (error) throw error;
	// Cast to AudioFile to ensure proper TS type based on the interface
	return audioFile as AudioFile;
}

/**
 * Retrieves a single audio file record by its unique primary key ID.
 *
 * @param id The UUID of the audio file.
 * @returns The AudioFile object, or null if not found.
 */
export async function findAudioFileById(id: string): Promise<AudioFile | null> {
	const { data, error } = await supabase
		.from("audio_files")
		.select("*")
		.eq("id", id)
		.single();

	// PGRST116 is the error code for "No rows found"
	if (error && error.code !== "PGRST116") throw error;

	return data as AudioFile | null;
}

/**
 * Retrieves a single audio file record by its URL.
 *
 * @param URL The UUID of the audio file.
 * @returns The AudioFile object, or null if not found.
 */
export async function findAudioFileByUrl(
	url: string
): Promise<AudioFile | null> {
	const { data, error } = await supabase
		.from("audio_files")
		.select("*")
		.eq("url", url)
		.single();

	// PGRST116 is the error code for "No rows found"
	if (error && error.code !== "PGRST116") throw error;

	return data as AudioFile | null;
}

/**
 * Retrieves all audio file records associated with a specific user.
 *
 * @param userId The ID of the owning user.
 * @returns An array of AudioFile objects.
 */
export async function findAudioFilesByUserId(
	userId: string
): Promise<AudioFile[]> {
	const { data, error } = await supabase
		.from("audio_files")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data as AudioFile[];
}

/**
 * Updates an existing audio file record.
 *
 * @param id The ID of the audio file to update.
 * @param updates The fields to update.
 * @returns The updated AudioFile object.
 */
export async function updateAudioFile(
	id: string,
	updates: Partial<Omit<AudioFile, "id" | "userId" | "createdAt">>
): Promise<AudioFile> {
	// Supabase needs snake_case for column names
	const payload = {
		email_id: updates.emailId,
		filename: updates.filename,
		url: updates.url,
		duration: updates.duration,
		size: updates.size,
		mime_type: updates.mimeType,
	};

	const { data, error } = await supabase
		.from("audio_files")
		.update(payload)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;
	return data as AudioFile;
}

/**
 * Deletes an audio file record by its ID.
 *
 * @param id The ID of the audio file to delete.
 */
export async function deleteAudioFile(id: string): Promise<void> {
	const { error } = await supabase.from("audio_files").delete().eq("id", id);

	if (error) throw error;
}

/**
 * Deletes an audio file record by its ID.
 *
 * @param url The URL of the audio file to delete.
 */
export async function deleteAudioFileByUrl(url: string): Promise<void> {
	const { error } = await supabase
		.from("audio_files")
		.delete()
		.eq("url", url);

	if (error) throw error;
}
