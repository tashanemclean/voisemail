import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
	// Protect all routes except public ones
	if (!isPublicRoute(request)) {
		const user = await auth();
		if (!user.userId) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
