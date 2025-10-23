import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY =
	process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");

if (ENCRYPTION_KEY.length !== 64) {
	throw new Error("ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
}

const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, "hex");

export function encrypt(text: string): string {
	try {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);

		let encrypted = cipher.update(text, "utf8", "hex");
		encrypted += cipher.final("hex");

		const authTag = cipher.getAuthTag();

		return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
	} catch (error) {
		console.error("Encryption error:", error);
		throw new Error("Failed to encrypt data");
	}
}

export function decrypt(encryptedData: string): string {
	try {
		const parts = encryptedData.split(":");
		if (parts.length !== 3) {
			throw new Error("Invalid encrypted data format");
		}

		const iv = Buffer.from(parts[0], "hex");
		const authTag = Buffer.from(parts[1], "hex");
		const encrypted = parts[2];

		const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
		decipher.setAuthTag(authTag);

		let decrypted = decipher.update(encrypted, "hex", "utf8");
		decrypted += decipher.final("utf8");

		return decrypted;
	} catch (error) {
		console.error("Decryption error:", error);
		throw new Error("Failed to decrypt data");
	}
}
