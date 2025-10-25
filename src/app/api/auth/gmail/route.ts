import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { config, validateConfig } from "@/lib/config";

export async function GET() {
	try {
		validateConfig();
		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Validate Gmail configuration
		if (
			!config.gmail.clientId ||
			!config.gmail.clientSecret ||
			!config.gmail.redirectUri
		) {
			console.error("Gmail OAuth configuration missing:", {
				hasClientId: !!config.gmail.clientId,
				hasClientSecret: !!config.gmail.clientSecret,
				hasRedirectUri: !!config.gmail.redirectUri,
			});

			return NextResponse.json(
				{
					error: "Gmail OAuth not configured properly",
					details:
						"Missing client_id, client_secret, or redirect_uri",
				},
				{ status: 500 }
			);
		}

		console.log("Gmail OAuth Config:", {
			clientId: config.gmail.clientId.substring(0, 20) + "...",
			redirectUri: config.gmail.redirectUri,
			clerkId: clerkId.substring(0, 10) + "...",
		});

		const oauth2Client = new google.auth.OAuth2(
			config.gmail.clientId,
			config.gmail.clientSecret,
			config.gmail.redirectUri
		);

		const scopes = [
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/gmail.modify",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		];

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: scopes,
			prompt: "consent",
			state: clerkId,
			include_granted_scopes: true,
		});

		console.log("Generated auth URL successfully");

		return NextResponse.json({
			authUrl,
			clientId: config.gmail.clientId,
		});
	} catch (error) {
		console.error("Error generating Gmail auth URL:", error);
		return NextResponse.json(
			{
				error: "Failed to generate authorization URL",
				message:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
