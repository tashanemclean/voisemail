import { prisma } from "./db";
import { GmailProvider } from "./gmail-provider";
import { AIProcessor } from "./ai-processor";

export class EmailService {
	private aiProcessor: AIProcessor;

	constructor() {
		this.aiProcessor = new AIProcessor();
	}

	async syncEmails(userId: string): Promise<number> {
		const accounts = await prisma.emailAccount.findMany({
			where: { userId, isActive: true },
		});

		let totalSynced = 0;

		for (const account of accounts) {
			if (account.provider === "gmail") {
				try {
					const provider = new GmailProvider(
						account.accessToken,
						account.refreshToken || undefined
					);

					// Validate token
					const isValid = await provider.validateToken();
					if (!isValid) {
						console.log(
							`Invalid token for account ${account.email}, attempting refresh...`
						);
						try {
							const { accessToken, expiryDate } =
								await provider.refreshAccessToken();
							await prisma.emailAccount.update({
								where: { id: account.id },
								data: {
									accessToken,
									tokenExpiry: expiryDate
										? new Date(expiryDate)
										: null,
								},
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
						const existing = await prisma.email.findUnique({
							where: {
								userId_externalId: {
									userId,
									externalId: emailData.externalId,
								},
							},
						});

						if (!existing) {
							await prisma.email.create({
								data: {
									userId,
									accountEmail: account.email,
									externalId: emailData.externalId,
									threadId: emailData.threadId,
									subject: emailData.subject,
									from: emailData.from,
									to: emailData.to,
									cc: emailData.cc,
									bcc: emailData.bcc,
									body: emailData.body,
									bodyHtml: emailData.bodyHtml,
									snippet: emailData.snippet,
									receivedAt: emailData.receivedAt,
									folder: emailData.folder,
									labels: emailData.labels,
									hasAttachments: emailData.hasAttachments,
									isRead: emailData.isRead,
									isStarred: emailData.isStarred,
								},
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
		const accounts = await prisma.emailAccount.findMany({
			where: { userId, isActive: true },
		});

		let totalSynced = 0;

		for (const account of accounts) {
			if (account.provider === "gmail") {
				try {
					const provider = new GmailProvider(
						account.accessToken,
						account.refreshToken || undefined
					);
					const emails = await provider.fetchJunkEmails(30);

					for (const emailData of emails) {
						const existing = await prisma.email.findUnique({
							where: {
								userId_externalId: {
									userId,
									externalId: emailData.externalId,
								},
							},
						});

						if (!existing) {
							const analysis =
								await this.aiProcessor.analyzeJunkEmail(
									emailData.subject,
									emailData.from,
									emailData.body
								);

							await prisma.email.create({
								data: {
									userId,
									accountEmail: account.email,
									externalId: emailData.externalId,
									threadId: emailData.threadId,
									subject: emailData.subject,
									from: emailData.from,
									to: emailData.to,
									cc: emailData.cc,
									bcc: emailData.bcc,
									body: emailData.body,
									bodyHtml: emailData.bodyHtml,
									snippet: emailData.snippet,
									receivedAt: emailData.receivedAt,
									folder: "junk",
									labels: emailData.labels,
									hasAttachments: emailData.hasAttachments,
									isRead: emailData.isRead,
									isStarred: emailData.isStarred,
									isJunk: analysis.isJunk,
									confidence: analysis.confidence,
									aiReason: analysis.reason,
								},
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

	async processEmail(emailId: string): Promise<any> {
		const email = await prisma.email.findUnique({
			where: { id: emailId },
			include: {
				user: {
					include: { voiceSettings: true },
				},
			},
		});

		if (!email || email.isProcessed) {
			return null;
		}

		const insights = await this.aiProcessor.analyzeEmail(
			email.subject,
			email.from,
			email.body
		);

		const voiceSettings = email.user.voiceSettings;
		const voiceId = voiceSettings?.voiceId || "21m00Tcm4TlvDq8ikWAM";
		const modelId = voiceSettings?.modelId || "eleven_turbo_v2_5";

		const customSettings = voiceSettings
			? {
					stability: voiceSettings.stability,
					similarity_boost: voiceSettings.similarityBoost,
					style: voiceSettings.style,
					use_speaker_boost: voiceSettings.useSpeakerBoost,
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
				email.userId,
				emailId,
				voiceId,
				modelId,
				customSettings
			);
		} catch (error) {
			console.error("Failed to generate audio:", error);
		}

		const updatedEmail = await prisma.email.update({
			where: { id: emailId },
			data: {
				isProcessed: true,
				summary: insights.summary,
				urgencyLevel: insights.urgencyLevel,
				isLead: insights.isLead,
				isJobOffer: insights.isJobOffer,
				audioUrl,
			},
		});

		for (const insight of insights.insights) {
			await prisma.insight.create({
				data: {
					emailId,
					type: insight.type,
					value: insight.value,
					confidence: insight.confidence,
				},
			});
		}

		return updatedEmail;
	}

	async batchProcessEmails(
		userId: string,
		limit: number = 10
	): Promise<any[]> {
		const unprocessedEmails = await prisma.email.findMany({
			where: {
				userId,
				isProcessed: false,
				folder: "inbox",
			},
			take: limit,
			orderBy: { receivedAt: "desc" },
		});

		const results = [];
		for (const email of unprocessedEmails) {
			try {
				const result = await this.processEmail(email.id);
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
		const email = await prisma.email.findFirst({
			where: { id: emailId, userId },
		});

		if (!email) {
			throw new Error("Email not found");
		}

		await prisma.email.update({
			where: { id: emailId },
			data: {
				isJunk,
				junkConfirmed: true,
				folder: isJunk ? "junk" : "inbox",
			},
		});

		if (!isJunk && email.externalId) {
			const account = await prisma.emailAccount.findFirst({
				where: { userId, email: email.accountEmail },
			});

			if (account) {
				try {
					const provider = new GmailProvider(
						account.accessToken,
						account.refreshToken || undefined
					);
					await provider.moveToInbox(email.externalId);
				} catch (error) {
					console.error("Failed to move email in Gmail:", error);
				}
			}
		}
	}

	async getEmailStats(userId: string) {
		const [
			totalEmails,
			processedEmails,
			criticalEmails,
			leads,
			jobOffers,
			junkToReview,
			unreadEmails,
		] = await Promise.all([
			prisma.email.count({
				where: { userId, folder: "inbox" },
			}),
			prisma.email.count({
				where: { userId, folder: "inbox", isProcessed: true },
			}),
			prisma.email.count({
				where: { userId, urgencyLevel: "critical" },
			}),
			prisma.email.count({
				where: { userId, isLead: true },
			}),
			prisma.email.count({
				where: { userId, isJobOffer: true },
			}),
			prisma.email.count({
				where: { userId, folder: "junk", junkConfirmed: false },
			}),
			prisma.email.count({
				where: { userId, folder: "inbox", isRead: false },
			}),
		]);

		return {
			totalEmails,
			processedEmails,
			unprocessedEmails: totalEmails - processedEmails,
			criticalEmails,
			leads,
			jobOffers,
			junkToReview,
			unreadEmails,
		};
	}
}
