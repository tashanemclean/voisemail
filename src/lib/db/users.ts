import { supabase } from "./supabase";
import type { User } from "../types";

export async function createUser(data: Partial<User>): Promise<User> {
	// Create user
	const { data: user, error: userError } = await supabase
		.from("users")
		.insert({
			clerk_id: data.clerk_id,
			email: data.email,
			first_name: data.first_name,
			last_name: data.last_name,
			image_url: data.image_url,
			subscription: data.subscription,
		})
		.select()
		.single();

	if (userError) throw userError;

	// Create default subscription
	const { error: subError } = await supabase.from("subscriptions").insert({
		user_id: user.id,
		plan: "starter",
		status: "active",
		emails_processed: 0,
		emails_limit: 50,
		current_period_start: new Date().toISOString(),
		current_period_end: new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000
		).toISOString(),
	});

	if (subError) throw subError;

	return user;
}

export async function findUserByClerkId(clerkId: string): Promise<User> {
	const { data, error } = await supabase
		.from("users")
		.select(
			`
		*,
		email_accounts(*),
		subscription:subscriptions(*),
		voice_settings(*)
	  `
		)
		.eq("clerk_id", clerkId)
		.single();

	if (error && error.code !== "PGRST116") throw error;

	// Transform to match expected structure
	if (data) {
		return {
			...data,
			email_accounts: data.email_accounts || [],
			subscription: Array.isArray(data.subscription)
				? data.subscription[0]
				: data.subscription,
			voice_settings: Array.isArray(data.voice_settings)
				? data.voice_settings[0]
				: data.voice_settings,
		};
	}

	return data;
}

export async function updateUser(
	clerkId: string,
	updates: {
		email?: string;
		first_name?: string | null;
		last_name?: string | null;
		image_url?: string | null;
	}
) {
	const { data, error } = await supabase
		.from("users")
		.update({
			...updates,
			updated_at: new Date().toISOString(),
		})
		.eq("clerk_id", clerkId)
		.select()
		.single();

	if (error) throw error;
	return data;
}
export async function deleteUser(clerkId: string) {
	const { error } = await supabase
		.from("users")
		.delete()
		.eq("clerk_id", clerkId);

	if (error) throw error;
}
