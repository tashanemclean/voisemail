import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET() {
	try {
		const { userId: clerkId } = await auth();

		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const configStatus = {
			gmailClientId: {
				exists: !!config.gmail.clientId,
				value: config.gmail.clientId
					? `${config.gmail.clientId.substring(0, 30)}...`
					: "NOT SET",
			},
			gmailClientSecret: {
				exists: !!config.gmail.clientSecret,
				value: config.gmail.clientSecret ? "SET (hidden)" : "NOT SET",
			},
			gmailRedirectUri: {
				exists: !!config.gmail.redirectUri,
				value: config.gmail.redirectUri || "NOT SET",
			},
			allConfigured: !!(
				config.gmail.clientId &&
				config.gmail.clientSecret &&
				config.gmail.redirectUri
			),
		};

		return NextResponse.json({
			status: "Configuration Check",
			config: configStatus,
			recommendation: !configStatus.allConfigured
				? "Please configure all Gmail OAuth environment variables"
				: "Configuration looks good!",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to check configuration" },
			{ status: 500 }
		);
	}
}
