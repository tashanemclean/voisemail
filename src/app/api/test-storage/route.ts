import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/db/supabase";
import { StorageService } from "@/lib/storage-service";

export async function GET() {
	try {
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Test 1: Check if bucket exists
		const { data: buckets, error: bucketsError } =
			await supabase.storage.listBuckets();

		if (bucketsError) {
			return NextResponse.json(
				{
					error: "Failed to list buckets",
					details: bucketsError.message,
				},
				{ status: 500 }
			);
		}

		const audiosBucket = buckets?.find((b) => b.name === "email-audio");

		if (!audiosBucket) {
			return NextResponse.json(
				{
					error: 'Bucket "email-audio" not found',
					hint: "Create it in Supabase Dashboard → Storage",
					availableBuckets: buckets?.map((b) => b.name),
				},
				{ status: 404 }
			);
		}

		// Test 2: Try to upload a test file
		const testBuffer = Buffer.from("test audio content");
		const storageService = new StorageService();

		try {
			const testUrl = await storageService.saveAudioFile(
				testBuffer,
				"test-user",
				"test-email"
			);

			// Test 3: Try to delete the test file
			await storageService.deleteAudioFile(testUrl);

			return NextResponse.json({
				success: true,
				message: "Storage is configured correctly!",
				bucket: audiosBucket.name,
				isPublic: audiosBucket.public,
			});
		} catch (uploadError) {
			return NextResponse.json(
				{
					error: "Upload test failed",
					details:
						uploadError instanceof Error
							? uploadError.message
							: "Unknown error",
					hint: "Check storage policies in Supabase Dashboard",
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Storage test error:", error);
		return NextResponse.json(
			{
				error: "Storage test failed",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
