import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "@/lib/db/users";
import { NextResponse } from "next/server";
import { User } from "@/lib/types";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		console.error("CLERK_WEBHOOK_SECRET is not set");
		return new Response("Webhook secret not configured", { status: 500 });
	}

	const headerPayload = headers();
	const header = await headerPayload;
	const svix_id = header.get("svix-id");
	const svix_timestamp = header.get("svix-timestamp");
	const svix_signature = header.get("svix-signature");

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		});
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);

	const wh = new Webhook(WEBHOOK_SECRET);
	let evt: WebhookEvent;

	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error occurred during verification", {
			status: 400,
		});
	}

	const eventType = evt.type;

	try {
		if (eventType === "user.created") {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			await createUser({
				clerk_id: id,
				email: email_addresses[0].email_address,
				first_name: first_name || undefined,
				last_name: last_name || undefined,
				image_url: image_url || undefined,
			});
		}

		if (eventType === "user.updated") {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			await updateUser(id, {
				email: email_addresses[0].email_address,
				first_name: first_name || null,
				last_name: last_name || null,
				image_url: image_url || null,
			} as User);
		}

		if (eventType === "user.deleted") {
			const { id } = evt.data;
			if (id) {
				await deleteUser(id);
			}
		}

		return NextResponse.json({ success: true, eventType });
	} catch (error) {
		console.error(`Error processing webhook event ${eventType}:`, error);
		return NextResponse.json(
			{ error: "Failed to process webhook event", eventType },
			{ status: 500 }
		);
	}
}
