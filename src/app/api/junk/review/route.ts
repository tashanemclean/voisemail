import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";
import { google } from "googleapis";
import { encrypt } from "@/lib/encryption"; // adjust to your path

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");

		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await prisma.user.findUnique({ where: { clerkId } });
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// --- If this is an OAuth callback (Gmail connection) ---
		if (code) {
			try {
				const oauth2Client = new google.auth.OAuth2(
					process.env.GMAIL_CLIENT_ID,
					process.env.GMAIL_CLIENT_SECRET,
					process.env.GMAIL_REDIRECT_URI
				);

				const { tokens } = await oauth2Client.getToken(code);
				oauth2Client.setCredentials(tokens);

				const gmail = google.gmail({
					version: "v1",
					auth: oauth2Client,
				});
				const profile = await gmail.users.getProfile({ userId: "me" });

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

		// --- Otherwise: Sync and return junk emails ---
		const emailService = new EmailService();
		await emailService.syncJunkEmails(user.id);

		const junkEmails = await prisma.email.findMany({
			where: {
				userId: user.id,
				folder: "junk",
				junkConfirmed: false,
			},
			orderBy: {
				receivedAt: "desc",
			},
		});

		return NextResponse.json(junkEmails);
	} catch (error) {
		console.error("Error in GET /emails route:", error);
		return NextResponse.json(
			{ error: "Failed to fetch junk emails" },
			{ status: 500 }
		);
	}
}
