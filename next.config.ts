import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

const nextConfig: NextConfig = {
	/* config options here */

	// 💡 ADD THIS EMPTY CONFIG
	// This explicitly tells Next.js to avoid Turbopack defaults in a way that respects the Webpack config.
	turbopack: {},

	webpack: (config, { isServer }) => {
		if (isServer) {
			config.plugins.push(new PrismaPlugin());
		}

		return config;
	},
};

export default nextConfig;
