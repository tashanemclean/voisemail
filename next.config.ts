import type { NextConfig } from "next";

// TypeScript doesn't have types for this Prisma plugin, so let's declare the module to avoid type errors
// You can optionally move this to a .d.ts file in your project root for better hygiene
// @ts-expect-error: No types available for this Prisma plugin module
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config, { isServer }) => {
		// We only need the plugin on the server-side build, where the Prisma Client runs
		if (isServer) {
			config.plugins.push(new PrismaPlugin());
		}

		return config;
	},
};

export default nextConfig;
