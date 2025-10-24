export const config = {
	clerk: {
		publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		secretKey: process.env.CLERK_SECRET_KEY,
		webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
	},
	database: {
		url: process.env.DATABASE_URL,
	},
	openai: {
		apiKey: process.env.OPENAI_API_KEY,
	},
	elevenlabs: {
		apiKey: process.env.ELEVENLABS_API_KEY,
	},
	gmail: {
		clientId: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		redirectUri: process.env.GMAIL_REDIRECT_URI,
	},
	encryption: {
		key: process.env.ENCRYPTION_KEY,
	},
	app: {
		url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	},
};

// Validation function
export function validateConfig() {
	const errors: string[] = [];

	if (!config.clerk.publishableKey) {
		errors.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required");
	}
	if (!config.clerk.secretKey) {
		errors.push("CLERK_SECRET_KEY is required");
	}
	if (!config.database.url) {
		errors.push("DATABASE_URL is required");
	}
	if (!config.openai.apiKey) {
		errors.push("OPENAI_API_KEY is required");
	}
	if (!config.elevenlabs.apiKey) {
		errors.push("ELEVENLABS_API_KEY is required");
	}
	if (!config.gmail.clientId) {
		errors.push("GMAIL_CLIENT_ID is required");
	}
	if (!config.gmail.clientSecret) {
		errors.push("GMAIL_CLIENT_SECRET is required");
	}
	if (!config.gmail.redirectUri) {
		errors.push("GMAIL_REDIRECT_URI is required");
	}
	if (!config.encryption.key) {
		errors.push("ENCRYPTION_KEY is required");
	}

	if (errors.length > 0) {
		throw new Error(`Configuration errors:\n${errors.join("\n")}`);
	}

	console.log("✅ Configuration validated successfully");
}
