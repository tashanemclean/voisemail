import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
	}

	// Get headers
	const headerPayload = headers();
	const header = await headerPayload;
	const svix_id = header.get("svix-id");
	const svix_timestamp = header.get("svix-timestamp");
	const svix_signature = header.get("svix-signature");

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing svix headers", { status: 400 });
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Verify webhook
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
		return new Response("Error: Verification failed", { status: 400 });
	}

	// Handle the event
	const eventType = evt.type;

	if (eventType === "user.created") {
		const { id, email_addresses, first_name, last_name } = evt.data;

		// Create user in database with free trial credits
		await prisma.user.create({
			data: {
				clerkId: id,
				email: email_addresses[0].email_address,
				name: `${first_name || ""} ${last_name || ""}`.trim(),
				plan: "FREE",
				credits: 2, // Free trial: 2 videos (6 credits since 3 per generation)
			},
		});

		console.log(`User created: ${email_addresses[0].email_address}`);
	}

	if (eventType === "user.updated") {
		const { id, email_addresses, first_name, last_name } = evt.data;

		await prisma.user.update({
			where: { clerkId: id },
			data: {
				email: email_addresses[0].email_address,
				name: `${first_name || ""} ${last_name || ""}`.trim(),
			},
		});
	}

	if (eventType === "user.deleted") {
		const { id } = evt.data;

		await prisma.user.delete({
			where: { clerkId: id },
		});

		console.log(`User deleted: ${id}`);
	}

	return new Response("Webhook received", { status: 200 });
}
