import type { NextConfig } from "next";

function hostPatternFromUrl(rawUrl?: string) {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    return {
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
      hostname: parsed.hostname,
    };
  } catch {
    return null;
  }
}

const wpHostPattern = hostPatternFromUrl(process.env.NEXT_PUBLIC_WORDPRESS_URL);
const graphqlHostPattern = hostPatternFromUrl(process.env.NEXT_PUBLIC_GRAPHQL_URL);

const nextConfig: NextConfig = {
  // Output standalone build for Docker deployment
  output: 'standalone',

  // Enable image optimization for WordPress images
  images: {
    remotePatterns: [
      ...(wpHostPattern ? [wpHostPattern] : []),
      ...(graphqlHostPattern ? [graphqlHostPattern] : []),
      {
        protocol: 'https',
        hostname: '**.wp.com',
      },
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        // MyGift production domain
        protocol: 'https',
        hostname: 'mygift.pk',
      },
      {
        // Backend WordPress host wildcard (headless setup)
        protocol: 'https',
        hostname: '**.inflowcommerce.com',
      },
      {
        // For local development
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        // Unsplash (used for optional demo banners)
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // WWW host
        protocol: 'https',
        hostname: 'www.mygift.pk',
      },
    ],
    // Image formats to use
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // Strict mode for better development
  reactStrictMode: true,

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
