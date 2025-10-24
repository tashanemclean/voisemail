export interface Stats {
	totalEmails: number;
	processedEmails: number;
	unprocessedEmails: number;
	criticalEmails: number;
	leads: number;
	jobOffers: number;
	junkToReview: number;
	unreadEmails: number;
}

export interface DashboardClientProps {
	user: DbUser;
}

export interface DbUser {
	id: string;
	clerkId: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	imageUrl: string | null;
	emailAccounts: {
		id: string;
		email: string;
		createdAt: Date;
		updatedAt: Date;
		userId: string;
		provider: string;
		accessToken: string;
		refreshToken: string | null;
		tokenExpiry: Date | null;
		isActive: boolean;
	}[];
	subscription: {
		plan: string;
		status: string;
		emailsProcessed: number;
		emailsLimit: number;
		currentPeriodEnd: Date;
	} | null;
	voiceSettings: {
		voiceId: string;
		voiceName: string;
	} | null;
}
