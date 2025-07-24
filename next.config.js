/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-supabase-url.supabase.co'],
  },
  eslint: {
    // Vercel 배포 시 ESLint 경고 무시
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig