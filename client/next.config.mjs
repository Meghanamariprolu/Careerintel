import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: join(__dirname, '../'),
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                       (isProd ? 'https://careerintel-uo0m.onrender.com' : 'http://127.0.0.1:5001');
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
