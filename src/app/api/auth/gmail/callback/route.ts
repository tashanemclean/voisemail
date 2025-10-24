import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// Assuming 'google' and 'encrypt' are imported from external files
import { google } from "googleapis";
import { encrypt } from "@/lib/encryption";

// The 'request' object is passed automatically in Next.js Route Handlers
export async function GET(request: Request) {
	try {
		// --- 1. Authentication and User Retrieval ---
		const url = new URL(request.url);
		const code = url.searchParams.get("code");

		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		const user = await prisma.user.findUnique({
			where: { clerkId },
		});

		if (!user) {
			return NextResponse.redirect(
				new URL("/dashboard?error=user_not_found", request.url)
			);
		}

		if (!code) {
			return NextResponse.redirect(
				new URL("/dashboard?error=no_code", request.url)
			);
		}

		// --- 2. Exchange Code for Tokens ---
		const oauth2Client = new google.auth.OAuth2(
			"1076369492895-34s78801tgccqvnke42rfk6brpu3oim2.apps.googleusercontent.com",
			"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",
			"https://www.voisemail.me/api/auth/gmail/callback"
		);

		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		// --- 3. Get User's Gmail address ---
		const gmail = google.gmail({ version: "v1", auth: oauth2Client });
		const profile = await gmail.users.getProfile({ userId: "me" });

		// --- 4. Store encrypted tokens ---
		await prisma.emailAccount.upsert({
			where: {
				userId_email: {
					userId: user.id,
					email: profile.data.emailAddress!,
				},
			},
			update: {
				accessToken: encrypt(tokens.access_token!),
				refreshToken: tokens.refresh_token
					? encrypt(tokens.refresh_token)
					: null,
				tokenExpiry: tokens.expiry_date
					? new Date(tokens.expiry_date)
					: null,
				isActive: true,
			},
			create: {
				userId: user.id,
				provider: "gmail",
				email: profile.data.emailAddress!,
				accessToken: encrypt(tokens.access_token!),
				refreshToken: tokens.refresh_token
					? encrypt(tokens.refresh_token)
					: null,
				tokenExpiry: tokens.expiry_date
					? new Date(tokens.expiry_date)
					: null,
				isActive: true,
			},
		});

		// --- 5. Success Redirect ---
		return NextResponse.redirect(
			new URL("/dashboard?connected=gmail", request.url)
		);
	} catch (error) {
		console.error("Error connecting Gmail:", error);
		return NextResponse.redirect(
			new URL("/dashboard?error=connection_failed", request.url)
		);
	}
}
