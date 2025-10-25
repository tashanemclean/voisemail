import { supabase } from "./supabase";
import type { Email } from "../types";

export async function getEmails(
	userId: string,
	folder: string = "inbox",
	page: number = 1,
	limit: number = 50
) {
	const from = (page - 1) * limit;
	const to = from + limit - 1;

	const { data, error, count } = await supabase
		.from("emails")
		.select("*, insights(*)", { count: "exact" })
		.eq("user_id", userId)
		.eq("folder", folder)
		.order("received_at", { ascending: false })
		.range(from, to);

	if (error) throw error;

	return {
		emails: data,
		total: count || 0,
		page,
		limit,
		pages: Math.ceil((count || 0) / limit),
	};
}

export async function getEmailById(emailId: string, userId: string) {
	const { data, error } = await supabase
		.from("emails")
		.select("*, insights(*), attachments(*)")
		.eq("id", emailId)
		.eq("user_id", userId)
		.single();

	if (error) throw error;
	return data;
}

export async function createEmail(email: Partial<Email>) {
	const { data, error } = await supabase
		.from("emails")
		.insert(email)
		.select()
		.single();

	if (error) {
		// Check if duplicate
		if (error.code === "23505") {
			return null; // Already exists
		}
		throw error;
	}
	return data;
}

export async function updateEmail(
	emailId: string,
	updates: Partial<Email>
): Promise<Email> {
	const { data, error } = await supabase
		.from("emails")
		.update(updates)
		.eq("id", emailId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteEmail(emailId: string, userId: string) {
	const { error } = await supabase
		.from("emails")
		.delete()
		.eq("id", emailId)
		.eq("user_id", userId);

	if (error) throw error;
}

export async function getUnprocessedEmails(
	userId: string,
	limit: number = 10
): Promise<Email[]> {
	const { data, error } = await supabase
		.from("emails")
		.select("*")
		.eq("user_id", userId)
		.eq("is_processed", false)
		.eq("folder", "inbox")
		.order("received_at", { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data || [];
}

export async function findEmailByExternalId(
	userId: string,
	externalId: string
) {
	const { data, error } = await supabase
		.from("emails")
		.select("*")
		.eq("user_id", userId)
		.eq("external_id", externalId)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	return data;
}

export async function getJunkEmailsForReview(userId: string) {
	const { data, error } = await supabase
		.from("emails")
		.select("*")
		.eq("user_id", userId)
		.eq("folder", "junk")
		.eq("junk_confirmed", false)
		.order("received_at", { ascending: false })
		.limit(50);

	if (error) throw error;
	return data || [];
}
