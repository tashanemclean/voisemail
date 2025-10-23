import { google, gmail_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { decrypt, encrypt } from "./encryption";

interface GmailEmail {
	externalId: string;
	threadId: string | null;
	subject: string;
	from: string;
	to: string[];
	cc: string[];
	bcc: string[];
	body: string;
	bodyHtml: string | null;
	snippet: string | null;
	receivedAt: Date;
	folder: string;
	labels: string[];
	hasAttachments: boolean;
	isRead: boolean;
	isStarred: boolean;
}

export class GmailProvider {
	private oauth2Client: OAuth2Client;
	private gmail: gmail_v1.Gmail;

	constructor(accessToken: string, refreshToken?: string) {
		this.oauth2Client = new google.auth.OAuth2(
			process.env.GMAIL_CLIENT_ID,
			process.env.GMAIL_CLIENT_SECRET,
			process.env.GMAIL_REDIRECT_URI
		);

		try {
			const decryptedAccessToken = decrypt(accessToken);
			const decryptedRefreshToken = refreshToken
				? decrypt(refreshToken)
				: undefined;

			this.oauth2Client.setCredentials({
				access_token: decryptedAccessToken,
				refresh_token: decryptedRefreshToken,
			});

			// Handle token refresh
			this.oauth2Client.on("tokens", (tokens) => {
				if (tokens.refresh_token) {
					console.log("New refresh token received");
				}
				console.log("Access token refreshed");
			});
		} catch (error) {
			console.error("Error setting Gmail credentials:", error);
			throw new Error("Invalid Gmail credentials");
		}

		this.gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
	}

	/**
	 * Fetch emails from Gmail
	 */
	async fetchEmails(
		maxResults: number = 50,
		pageToken?: string,
		query?: string
	): Promise<{
		emails: GmailEmail[];
		nextPageToken: string | null;
	}> {
		try {
			const response = await this.gmail.users.messages.list({
				userId: "me",
				maxResults,
				pageToken,
				q: query || "in:inbox",
			});

			if (
				!response.data.messages ||
				response.data.messages.length === 0
			) {
				return { emails: [], nextPageToken: null };
			}

			const emailPromises = response.data.messages.map((message) =>
				this.getEmailDetails(message.id!)
			);

			const emails = await Promise.all(emailPromises);
			const validEmails = emails.filter(
				(email) => email !== null
			) as GmailEmail[];

			return {
				emails: validEmails,
				nextPageToken: response.data.nextPageToken || null,
			};
		} catch (error) {
			console.error("Error fetching emails:", error);
			throw new Error("Failed to fetch emails from Gmail");
		}
	}

	/**
	 * Get detailed email information
	 */
	async getEmailDetails(messageId: string): Promise<GmailEmail | null> {
		try {
			const response = await this.gmail.users.messages.get({
				userId: "me",
				id: messageId,
				format: "full",
			});

			const message = response.data;
			const headers = message.payload?.headers || [];

			// Extract headers
			const getHeader = (name: string): string => {
				const header = headers.find(
					(h) => h.name?.toLowerCase() === name.toLowerCase()
				);
				return header?.value || "";
			};

			const subject = getHeader("Subject") || "No Subject";
			const from = getHeader("From");
			const to = getHeader("To")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			const cc = getHeader("Cc")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			const bcc = getHeader("Bcc")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			const date = getHeader("Date");

			// Extract body
			const { body, bodyHtml } = this.extractBody(message.payload!);

			// Check for attachments
			const hasAttachments = this.hasAttachments(message.payload!);

			// Determine folder based on labels
			const labels = message.labelIds || [];
			const folder = this.determineFolder(labels);

			// Check read and starred status
			const isRead = !labels.includes("UNREAD");
			const isStarred = labels.includes("STARRED");

			return {
				externalId: message.id!,
				threadId: message.threadId || null,
				subject,
				from,
				to,
				cc,
				bcc,
				body,
				bodyHtml,
				snippet: message.snippet || null,
				receivedAt: new Date(date || Date.now()),
				folder,
				labels,
				hasAttachments,
				isRead,
				isStarred,
			};
		} catch (error) {
			console.error(
				`Error getting email details for ${messageId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Extract email body from payload
	 */
	private extractBody(payload: gmail_v1.Schema$MessagePart): {
		body: string;
		bodyHtml: string | null;
	} {
		let body = "";
		let bodyHtml: string | null = null;

		const decodeBody = (data: string | undefined): string => {
			if (!data) return "";
			try {
				return Buffer.from(data, "base64").toString("utf-8");
			} catch {
				return "";
			}
		};

		// Check if body is directly in payload
		if (payload.body?.data) {
			body = decodeBody(payload.body.data);
		}

		// Check parts for text/plain and text/html
		if (payload.parts) {
			for (const part of payload.parts) {
				if (part.mimeType === "text/plain" && part.body?.data) {
					body = decodeBody(part.body.data);
				}
				if (part.mimeType === "text/html" && part.body?.data) {
					bodyHtml = decodeBody(part.body.data);
				}

				// Recursively check nested parts
				if (part.parts) {
					const nested = this.extractBody(part);
					if (!body && nested.body) body = nested.body;
					if (!bodyHtml && nested.bodyHtml)
						bodyHtml = nested.bodyHtml;
				}
			}
		}

		// Strip HTML tags from body if HTML is present but plain text isn't
		if (!body && bodyHtml) {
			body = bodyHtml
				.replace(/<[^>]*>/g, " ")
				.replace(/\s+/g, " ")
				.trim();
		}

		return { body, bodyHtml };
	}

	/**
	 * Check if email has attachments
	 */
	private hasAttachments(payload: gmail_v1.Schema$MessagePart): boolean {
		if (payload.parts) {
			return payload.parts.some(
				(part) => part.filename && part.filename.length > 0
			);
		}
		return false;
	}

	/**
	 * Determine folder based on Gmail labels
	 */
	private determineFolder(labels: string[]): string {
		if (labels.includes("SPAM")) return "junk";
		if (labels.includes("TRASH")) return "trash";
		if (labels.includes("SENT")) return "sent";
		if (labels.includes("DRAFT")) return "drafts";
		if (labels.includes("INBOX")) return "inbox";
		return "inbox";
	}

	/**
	 * Fetch spam/junk emails
	 */
	async fetchJunkEmails(maxResults: number = 50): Promise<GmailEmail[]> {
		const { emails } = await this.fetchEmails(
			maxResults,
			undefined,
			"in:spam"
		);
		return emails;
	}

	/**
	 * Move email to inbox (remove spam label)
	 */
	async moveToInbox(messageId: string): Promise<void> {
		try {
			await this.gmail.users.messages.modify({
				userId: "me",
				id: messageId,
				requestBody: {
					removeLabelIds: ["SPAM"],
					addLabelIds: ["INBOX"],
				},
			});
		} catch (error) {
			console.error(`Error moving email ${messageId} to inbox:`, error);
			throw new Error("Failed to move email to inbox");
		}
	}

	/**
	 * Mark email as read
	 */
	async markAsRead(messageId: string): Promise<void> {
		try {
			await this.gmail.users.messages.modify({
				userId: "me",
				id: messageId,
				requestBody: {
					removeLabelIds: ["UNREAD"],
				},
			});
		} catch (error) {
			console.error(`Error marking email ${messageId} as read:`, error);
			throw new Error("Failed to mark email as read");
		}
	}

	/**
	 * Mark email as unread
	 */
	async markAsUnread(messageId: string): Promise<void> {
		try {
			await this.gmail.users.messages.modify({
				userId: "me",
				id: messageId,
				requestBody: {
					addLabelIds: ["UNREAD"],
				},
			});
		} catch (error) {
			console.error(`Error marking email ${messageId} as unread:`, error);
			throw new Error("Failed to mark email as unread");
		}
	}

	/**
	 * Star email
	 */
	async starEmail(messageId: string): Promise<void> {
		try {
			await this.gmail.users.messages.modify({
				userId: "me",
				id: messageId,
				requestBody: {
					addLabelIds: ["STARRED"],
				},
			});
		} catch (error) {
			console.error(`Error starring email ${messageId}:`, error);
			throw new Error("Failed to star email");
		}
	}

	/**
	 * Unstar email
	 */
	async unstarEmail(messageId: string): Promise<void> {
		try {
			await this.gmail.users.messages.modify({
				userId: "me",
				id: messageId,
				requestBody: {
					removeLabelIds: ["STARRED"],
				},
			});
		} catch (error) {
			console.error(`Error unstarring email ${messageId}:`, error);
			throw new Error("Failed to unstar email");
		}
	}

	/**
	 * Delete email (move to trash)
	 */
	async deleteEmail(messageId: string): Promise<void> {
		try {
			await this.gmail.users.messages.trash({
				userId: "me",
				id: messageId,
			});
		} catch (error) {
			console.error(`Error deleting email ${messageId}:`, error);
			throw new Error("Failed to delete email");
		}
	}

	/**
	 * Get user profile
	 */
	async getUserProfile(): Promise<{
		email: string;
		messagesTotal: number;
		threadsTotal: number;
	}> {
		try {
			const response = await this.gmail.users.getProfile({
				userId: "me",
			});

			return {
				email: response.data.emailAddress!,
				messagesTotal: response.data.messagesTotal || 0,
				threadsTotal: response.data.threadsTotal || 0,
			};
		} catch (error) {
			console.error("Error getting user profile:", error);
			throw new Error("Failed to get user profile");
		}
	}

	/**
	 * Check if token is valid
	 */
	async validateToken(): Promise<boolean> {
		try {
			await this.gmail.users.getProfile({ userId: "me" });
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Refresh access token
	 */
	async refreshAccessToken(): Promise<{
		accessToken: string;
		expiryDate: number | null;
	}> {
		try {
			const { credentials } =
				await this.oauth2Client.refreshAccessToken();

			return {
				accessToken: encrypt(credentials.access_token!),
				expiryDate: credentials.expiry_date || null,
			};
		} catch (error) {
			console.error("Error refreshing access token:", error);
			throw new Error("Failed to refresh access token");
		}
	}
}
