import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
		console.error("Missing svix headers");
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		});
	}

	const payload = await req.text();
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
	console.log("Webhook event type:", eventType);

	try {
		if (eventType === "user.created") {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			console.log("Creating user:", id);

			await prisma.user.create({
				data: {
					clerkId: id,
					email: email_addresses[0].email_address,
					firstName: first_name || null,
					lastName: last_name || null,
					imageUrl: image_url || null,
					subscription: {
						create: {
							plan: "starter",
							status: "active",
							emailsProcessed: 0,
							emailsLimit: 50,
							currentPeriodStart: new Date(),
							currentPeriodEnd: new Date(
								Date.now() + 30 * 24 * 60 * 60 * 1000
							),
							cancelAtPeriodEnd: false,
						},
					},
				},
			});

			console.log("User created successfully:", id);
		}

		if (eventType === "user.updated") {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			console.log("Updating user:", id);

			await prisma.user.update({
				where: { clerkId: id },
				data: {
					email: email_addresses[0].email_address,
					firstName: first_name || null,
					lastName: last_name || null,
					imageUrl: image_url || null,
				},
			});

			console.log("User updated successfully:", id);
		}

		if (eventType === "user.deleted") {
			const { id } = evt.data;

			if (id) {
				console.log("Deleting user:", id);

				await prisma.user.delete({
					where: { clerkId: id },
				});

				console.log("User deleted successfully:", id);
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
