/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double R3F mounting in dev mode
  serverExternalPackages: ['@mediapipe/tasks-vision'],
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config, { isServer }) => {
    config.externals.push({
      canvas: 'commonjs canvas',
    });
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
