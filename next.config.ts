import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const destination =
      process.env.NEXT_PUBLIC_API_URL_REWRITE ||
      "https://reposight.up.railway.app/:path*";

    return [
      {
        source: "/api/:path*",
        destination,
      },
    ];
  },
};

export default nextConfig;
