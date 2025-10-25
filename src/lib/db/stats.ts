import { supabase } from "./supabase";

export async function getEmailStats(userId: string) {
	const [
		{ count: totalEmails },
		{ count: processedEmails },
		{ count: criticalEmails },
		{ count: leads },
		{ count: jobOffers },
		{ count: junkToReview },
		{ count: unreadEmails },
	] = await Promise.all([
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("folder", "inbox"),
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("folder", "inbox")
			.eq("is_processed", true),
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("urgency_level", "critical"),
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("is_lead", true),
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("is_job_offer", true),
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("folder", "junk")
			.eq("junk_confirmed", false),
		supabase
			.from("emails")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("folder", "inbox")
			.eq("is_read", false),
	]);

	return {
		totalEmails: totalEmails || 0,
		processedEmails: processedEmails || 0,
		unprocessedEmails: (totalEmails || 0) - (processedEmails || 0),
		criticalEmails: criticalEmails || 0,
		leads: leads || 0,
		jobOffers: jobOffers || 0,
		junkToReview: junkToReview || 0,
		unreadEmails: unreadEmails || 0,
	};
}
