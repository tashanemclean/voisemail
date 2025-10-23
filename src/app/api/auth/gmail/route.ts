import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
	try {
		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const oauth2Client = new google.auth.OAuth2(
			process.env.GMAIL_CLIENT_ID,
			process.env.GMAIL_CLIENT_SECRET,
			process.env.GMAIL_REDIRECT_URI
		);

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: [
				"https://www.googleapis.com/auth/gmail.readonly",
				"https://www.googleapis.com/auth/gmail.modify",
				"https://www.googleapis.com/auth/userinfo.email",
			],
			prompt: "consent",
		});

		return NextResponse.json({ authUrl });
	} catch (error) {
		console.error("Error generating auth URL:", error);
		return NextResponse.json(
			{ error: "Failed to generate auth URL" },
			{ status: 500 }
		);
	}
}
