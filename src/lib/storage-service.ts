import fs from "fs";
import path from "path";
import {
	createAudioFile,
	deleteAudioFileByUrl,
	findAudioFileByUrl,
} from "./db/audio-files";

export class StorageService {
	private uploadDir: string;

	constructor() {
		// Use public/uploads directory for audio files
		this.uploadDir = path.join(process.cwd(), "public", "uploads", "audio");

		// Create directory if it doesn't exist
		if (!fs.existsSync(this.uploadDir)) {
			fs.mkdirSync(this.uploadDir, { recursive: true });
		}
	}

	/**
	 * Save audio file and create database record
	 */
	async saveAudioFile(
		buffer: Buffer,
		userId: string,
		emailId?: string
	): Promise<string> {
		try {
			const filename = `${userId}-${Date.now()}.mp3`;
			const filepath = path.join(this.uploadDir, filename);

			// Write file to disk
			fs.writeFileSync(filepath, buffer);

			// Create database record
			await createAudioFile({
				userId,
				emailId: emailId ?? null,
				filename,
				url: `/uploads/audio/${filename}`,
				size: buffer.length,
				mimeType: "audio/mpeg",
			});

			// Return public URL
			return `/uploads/audio/${filename}`;
		} catch (error) {
			console.error("Error saving audio file:", error);
			throw new Error("Failed to save audio file");
		}
	}

	/**
	 * Delete audio file
	 */
	async deleteAudioFile(url: string): Promise<void> {
		try {
			const filename = path.basename(url);
			const filepath = path.join(this.uploadDir, filename);

			// Delete file from disk
			if (fs.existsSync(filepath)) {
				fs.unlinkSync(filepath);
			}

			// Delete database record
			await deleteAudioFileByUrl(url);
		} catch (error) {
			console.error("Error deleting audio file:", error);
			throw new Error("Failed to delete audio file");
		}
	}

	/**
	 * Get audio file info
	 */
	async getAudioFile(url: string) {
		return await findAudioFileByUrl(url);
	}
}
