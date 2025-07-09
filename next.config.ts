import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/storage/v1/object/public/**',
      },
/*       {
        protocol: 'http',
        hostname: '192.168.1.16',
        port: '8000',
        pathname: '/storage/v1/object/public/**',
      }, */
      {
        protocol: 'http',
        hostname: '192.168.1.16',
        port: '8001',
        pathname: '/storage/v1/object/public/**',
      },
/*       {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8001',
        pathname: '/storage/v1/object/public/**',
      }, */
      // Production için HTTPS hostname'leri de ekleyebilirsin
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   pathname: '/storage/v1/object/public/**',
      // },
    ],
    // Placeholder.svg ve diğer local assets için
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default config;
