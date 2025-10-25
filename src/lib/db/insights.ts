import { supabase } from "./supabase";
import type { Insight } from "../types";

export async function createInsight(
	insight: Omit<Insight, "id" | "created_at">
) {
	const { data, error } = await supabase
		.from("insights")
		.insert(insight)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function getInsightsByEmailId(emailId: string) {
	const { data, error } = await supabase
		.from("insights")
		.select("*")
		.eq("email_id", emailId)
		.order("confidence", { ascending: false });

	if (error) throw error;
	return data || [];
}
