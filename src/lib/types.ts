/**
 * Interface representing the database row for the 'audio_files' table.
 * All types reflect the PostgreSQL schema definitions.
 */
export interface AudioFile {
	// id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
	// Optional because we want it returned only by db
	id?: string;

	// user_id UUID REFERENCES users(id) ON DELETE CASCADE
	userId: string;

	// email_id UUID REFERENCES emails(id) ON DELETE SET NULL
	emailId: string | null;

	// filename TEXT NOT NULL
	filename: string;

	// url TEXT NOT NULL
	url: string;

	// duration FLOAT (nullable)
	duration?: number | null;

	// size INTEGER NOT NULL
	size: number;

	// mime_type TEXT DEFAULT 'audio/mpeg'
	mimeType: string;

	// created_at TIMESTAMPTZ DEFAULT NOW()
	createdAt: Date;
}
export interface User {
	id: string;
	clerk_id: string;
	email: string;
	first_name?: string;
	last_name?: string;
	image_url?: string;
	created_at: string;
	updated_at: string;

	email_accounts?: EmailAccount[];
	subscription?: Subscription;
	voice_settings?: VoiceSettings;
}

export interface EmailAccount {
	id: string;
	user_id: string;
	provider: string;
	email: string;
	access_token: string;
	refresh_token?: string;
	token_expiry?: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Email {
	id: string;
	user_id: string;
	account_email: string;
	external_id: string;
	thread_id?: string;
	subject: string;
	from: string;
	to: string[];
	cc: string[];
	bcc: string[];
	body: string;
	body_html?: string;
	snippet?: string;
	received_at: string;
	folder: string;
	labels: string[];
	is_processed: boolean;
	audio_url?: string;
	summary?: string;
	urgency_level?: string;
	is_lead: boolean;
	is_job_offer: boolean;
	is_junk?: boolean;
	junk_confirmed: boolean;
	ai_reason?: string;
	confidence?: number;
	has_attachments: boolean;
	is_read: boolean;
	is_starred: boolean;
	created_at: string;
	updated_at: string;
}

export interface Insight {
	id: string;
	email_id: string;
	type: string;
	value: string;
	confidence: number;
	metadata?: object;
	created_at: string;
}

export interface VoiceSettings {
	id: string;
	user_id: string;
	voice_id: string;
	voice_name: string;
	model_id: string;
	stability: number;
	similarity_boost: number;
	style: number;
	use_speaker_boost: boolean;
	created_at: string;
	updated_at: string;
}

export interface Subscription {
	id?: string;
	user_id: string;
	plan: string;
	status: string;
	emails_processed: number;
	emails_limit: number;
	current_period_start: Date;
	current_period_end: Date;
	cancel_at_period_end: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface GmailTest {
	status: string;
	config: {
		gmailClientId: {
			exists: boolean;
			value: string;
		};
		gmailClientSecret: {
			exists: boolean;
			value: string;
		};
		gmailRedirectUri: {
			exists: boolean;
			value: string;
		};
		allConfigured: boolean;
	};
	recommendation: string;
}

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
