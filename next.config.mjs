/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  cleanDistDir: true,
  distDir: 'dist',
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
