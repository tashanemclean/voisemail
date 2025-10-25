import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { findUserByClerkId } from "@/lib/db/users";
import { createOrUpdateEmailAccount } from "@/lib/db/email-accounts";
import { encrypt } from "@/lib/encryption";

export async function GET(request: Request) {
	try {
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		const user = await findUserByClerkId(clerkId);
		if (!user) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");
		const error = searchParams.get("error");
		const state = searchParams.get("state");

		if (error) {
			return NextResponse.redirect(
				new URL(
					`/dashboard?error=gmail_auth_failed&reason=${error}`,
					request.url
				)
			);
		}

		if (!code) {
			return NextResponse.redirect(
				new URL("/dashboard?error=no_authorization_code", request.url)
			);
		}

		if (state !== clerkId) {
			return NextResponse.redirect(
				new URL("/dashboard?error=invalid_state", request.url)
			);
		}

		const oauth2Client = new google.auth.OAuth2(
			process.env.GMAIL_CLIENT_ID,
			process.env.GMAIL_CLIENT_SECRET,
			process.env.GMAIL_REDIRECT_URI
		);

		const { tokens } = await oauth2Client.getToken(code);

		if (!tokens.access_token) {
			return NextResponse.redirect(
				new URL("/dashboard?error=no_access_token", request.url)
			);
		}

		oauth2Client.setCredentials(tokens);

		const gmail = google.gmail({ version: "v1", auth: oauth2Client });
		const profile = await gmail.users.getProfile({ userId: "me" });

		if (!profile.data.emailAddress) {
			return NextResponse.redirect(
				new URL("/dashboard?error=no_email_address", request.url)
			);
		}

		const emailAddress = profile.data.emailAddress;

		await createOrUpdateEmailAccount({
			userId: user.id,
			provider: "gmail",
			email: emailAddress,
			accessToken: encrypt(tokens.access_token),
			refreshToken: tokens.refresh_token
				? encrypt(tokens.refresh_token)
				: undefined,
			tokenExpiry: tokens.expiry_date
				? new Date(tokens.expiry_date)
				: undefined,
		});

		return NextResponse.redirect(
			new URL(
				`/dashboard?connected=gmail&email=${encodeURIComponent(
					emailAddress
				)}`,
				request.url
			)
		);
	} catch (error) {
		console.error("Error in Gmail OAuth callback:", error);
		return NextResponse.redirect(
			new URL("/dashboard?error=connection_failed", request.url)
		);
	}
}
