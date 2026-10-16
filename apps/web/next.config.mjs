/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Proxy API calls through Next so the browser sees one origin (no CORS, cookies just work).
  async rewrites() {
    const api = (process.env.API_URL || "http://localhost:4000").replace(/\/+$/, "");
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
  experimental: { optimizePackageImports: ["lucide-react", "recharts"] },
};
export default nextConfig;
