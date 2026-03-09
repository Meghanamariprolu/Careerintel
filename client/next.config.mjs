/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                       (isProd ? 'https://careerintel-uo0m.onrender.com' : 'http://localhost:5000');
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
