import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimizaciones de rendimiento
  reactStrictMode: true,
  
  // Optimizar imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Comprimir respuestas
  compress: true,
  
  // ESLint configuración para build
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Headers para optimización y Service Workers
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
  
  webpack: (config, { isServer }) => {
    // Asegurar que el Service Worker se sirva correctamente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Optimizar el tamaño del bundle
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    
    return config;
  },
};

export default nextConfig;
