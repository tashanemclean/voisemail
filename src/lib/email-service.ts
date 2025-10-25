import { GmailProvider } from "./gmail-provider";
import { AIProcessor } from "./ai-processor";
import * as emailDb from "./db/emails";
import * as accountDb from "./db/email-accounts";
import * as insightDb from "./db/insights";

export class EmailService {
	private aiProcessor: AIProcessor;

	constructor() {
		this.aiProcessor = new AIProcessor();
	}

	async syncEmails(userId: string): Promise<number> {
		const accounts = await accountDb.getAllActiveAccounts(userId);
		let totalSynced = 0;

		for (const account of accounts) {
			if (account.provider === "gmail") {
				try {
					const provider = new GmailProvider(
						account.access_token,
						account.refresh_token || undefined
					);

					const isValid = await provider.validateToken();
					if (!isValid) {
						try {
							const { accessToken, expiryDate } =
								await provider.refreshAccessToken();
							await accountDb.updateEmailAccount(account.id, {
								access_token: accessToken,
								token_expiry: expiryDate
									? new Date(expiryDate).toISOString()
									: undefined,
							});
						} catch (error) {
							console.error(
								`Failed to refresh token for ${account.email}`
							);
							continue;
						}
					}

					const { emails } = await provider.fetchEmails(50);

					for (const emailData of emails) {
						const existing = await emailDb.findEmailByExternalId(
							userId,
							emailData.externalId
						);

						if (!existing) {
							await emailDb.createEmail({
								user_id: userId,
								account_email: account.email,
								external_id: emailData.externalId,
								thread_id: emailData.threadId ?? undefined,
								subject: emailData.subject,
								from: emailData.from,
								to: emailData.to,
								cc: emailData.cc,
								bcc: emailData.bcc,
								body: emailData.body,
								body_html: emailData.bodyHtml ?? undefined,
								snippet: emailData.snippet ?? undefined,
								received_at: emailData.receivedAt.toISOString(),
								folder: emailData.folder,
								labels: emailData.labels,
								has_attachments: emailData.hasAttachments,
								is_read: emailData.isRead,
								is_starred: emailData.isStarred,
								is_processed: false,
								is_lead: false,
								is_job_offer: false,
								junk_confirmed: false,
							});
							totalSynced++;
						}
					}
				} catch (error) {
					console.error(
						`Error syncing emails for ${account.email}:`,
						error
					);
				}
			}
		}

		return totalSynced;
	}

	async syncJunkEmails(userId: string): Promise<number> {
		const accounts = await accountDb.getAllActiveAccounts(userId);
		let totalSynced = 0;

		for (const account of accounts) {
			if (account.provider === "gmail") {
				try {
					const provider = new GmailProvider(
						account.access_token,
						account.refresh_token || undefined
					);
					const emails = await provider.fetchJunkEmails(30);

					for (const emailData of emails) {
						const existing = await emailDb.findEmailByExternalId(
							userId,
							emailData.externalId
						);

						if (!existing) {
							const analysis =
								await this.aiProcessor.analyzeJunkEmail(
									emailData.subject,
									emailData.from,
									emailData.body
								);

							await emailDb.createEmail({
								user_id: userId,
								account_email: account.email,
								external_id: emailData.externalId,
								thread_id: emailData.threadId ?? undefined,
								subject: emailData.subject,
								from: emailData.from,
								to: emailData.to,
								cc: emailData.cc,
								bcc: emailData.bcc,
								body: emailData.body,
								body_html: emailData.bodyHtml ?? undefined,
								snippet: emailData.snippet ?? undefined,
								received_at: emailData.receivedAt.toISOString(),
								folder: "junk",
								labels: emailData.labels,
								has_attachments: emailData.hasAttachments,
								is_read: emailData.isRead,
								is_starred: emailData.isStarred,
								is_junk: analysis.isJunk,
								confidence: analysis.confidence,
								ai_reason: analysis.reason,
								is_processed: false,
								is_lead: false,
								is_job_offer: false,
								junk_confirmed: false,
							});
							totalSynced++;
						}
					}
				} catch (error) {
					console.error(
						`Error syncing junk emails for ${account.email}:`,
						error
					);
				}
			}
		}

		return totalSynced;
	}

	async processEmail(emailId: string, userId: string) {
		const email = await emailDb.getEmailById(emailId, userId);

		if (!email || email.is_processed) {
			return null;
		}

		const insights = await this.aiProcessor.analyzeEmail(
			email.subject,
			email.from,
			email.body
		);

		// Get voice settings
		const { getVoiceSettings } = await import("./db/voice-settings");
		const voiceSettings = await getVoiceSettings(userId);

		const voiceId = voiceSettings?.voice_id || "21m00Tcm4TlvDq8ikWAM";
		const modelId = voiceSettings?.model_id || "eleven_turbo_v2_5";

		const customSettings = voiceSettings
			? {
					stability: voiceSettings.stability,
					similarity_boost: voiceSettings.similarity_boost,
					style: voiceSettings.style,
					use_speaker_boost: voiceSettings.use_speaker_boost,
			  }
			: undefined;

		let audioUrl: string | null = null;
		try {
			const narration = `Email from ${email.from}. Subject: ${
				email.subject
			}. ${
				insights.urgencyLevel === "critical" ? "This is urgent. " : ""
			}${insights.summary}`;

			audioUrl = await this.aiProcessor.generateAudio(
				narration,
				userId,
				emailId,
				voiceId,
				modelId,
				customSettings
			);
		} catch (error) {
			console.error("Failed to generate audio:", error);
		}

		const updatedEmail = await emailDb.updateEmail(emailId, {
			is_processed: true,
			summary: insights.summary,
			urgency_level: insights.urgencyLevel,
			is_lead: insights.isLead,
			is_job_offer: insights.isJobOffer,
			audio_url: audioUrl ?? undefined,
		});

		for (const insight of insights.insights) {
			await insightDb.createInsight({
				email_id: emailId,
				type: insight.type,
				value: insight.value,
				confidence: insight.confidence,
			});
		}

		return updatedEmail;
	}

	async batchProcessEmails(userId: string, limit: number = 10) {
		const unprocessedEmails = await emailDb.getUnprocessedEmails(
			userId,
			limit
		);

		const results = [];
		for (const email of unprocessedEmails) {
			try {
				const result = await this.processEmail(email.id, userId);
				if (result) results.push(result);
			} catch (error) {
				console.error(`Failed to process email ${email.id}:`, error);
			}
		}

		return results;
	}

	async confirmJunkStatus(
		emailId: string,
		isJunk: boolean,
		userId: string
	): Promise<void> {
		const email = await emailDb.getEmailById(emailId, userId);

		if (!email) {
			throw new Error("Email not found");
		}

		await emailDb.updateEmail(emailId, {
			is_junk: isJunk,
			junk_confirmed: true,
			folder: isJunk ? "junk" : "inbox",
		});

		if (!isJunk && email.external_id) {
			const account = await accountDb.getEmailAccountWithTokens(
				userId,
				email.account_email
			);

			if (account) {
				try {
					const provider = new GmailProvider(
						account.access_token,
						account.refresh_token || undefined
					);
					await provider.moveToInbox(email.external_id);
				} catch (error) {
					console.error("Failed to move email in Gmail:", error);
				}
			}
		}
	}

	async getEmailStats(userId: string) {
		const { getEmailStats } = await import("./db/stats");
		return await getEmailStats(userId);
	}
}
