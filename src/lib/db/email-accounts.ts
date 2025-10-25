import { supabase } from "./supabase";
import type { EmailAccount } from "../types";

export async function getEmailAccounts(userId: string) {
	const { data, error } = await supabase
		.from("email_accounts")
		.select("id, provider, email, is_active, created_at, updated_at")
		.eq("user_id", userId)
		.eq("is_active", true)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data || [];
}

export async function getEmailAccountWithTokens(userId: string, email: string) {
	const { data, error } = await supabase
		.from("email_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("email", email)
		.eq("is_active", true)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	return data;
}

export async function getAllActiveAccounts(userId: string) {
	const { data, error } = await supabase
		.from("email_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("is_active", true);

	if (error) throw error;
	return data || [];
}

export async function createOrUpdateEmailAccount(account: {
	userId: string;
	provider: string;
	email: string;
	accessToken: string;
	refreshToken?: string;
	tokenExpiry?: Date;
}) {
	const { data: existing } = await supabase
		.from("email_accounts")
		.select("id")
		.eq("user_id", account.userId)
		.eq("email", account.email)
		.single();

	if (existing) {
		const { data, error } = await supabase
			.from("email_accounts")
			.update({
				access_token: account.accessToken,
				refresh_token: account.refreshToken,
				token_expiry: account.tokenExpiry?.toISOString(),
				is_active: true,
				updated_at: new Date().toISOString(),
			})
			.eq("id", existing.id)
			.select()
			.single();

		if (error) throw error;
		return data;
	} else {
		const { data, error } = await supabase
			.from("email_accounts")
			.insert({
				user_id: account.userId,
				provider: account.provider,
				email: account.email,
				access_token: account.accessToken,
				refresh_token: account.refreshToken,
				token_expiry: account.tokenExpiry?.toISOString(),
				is_active: true,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}

export async function updateEmailAccount(
	accountId: string,
	updates: Partial<EmailAccount>
) {
	const { data, error } = await supabase
		.from("email_accounts")
		.update({
			...updates,
			updated_at: new Date().toISOString(),
		})
		.eq("id", accountId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteEmailAccount(accountId: string, userId: string) {
	const { error } = await supabase
		.from("email_accounts")
		.delete()
		.eq("id", accountId)
		.eq("user_id", userId);

	if (error) throw error;
}
