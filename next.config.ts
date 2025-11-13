import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const allowImage = [
  "i.ytimg.com",
  "i.pinimg.com",
  "images.unsplash.com",
  "cdn.sanity.io",
  "lh3.googleusercontent.com",
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...allowImage.map((domain) => ({
        protocol: "https" as const,
        hostname: domain,
      })),
      { protocol: "https", hostname: "**.togruleminov.site" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 1024, 1920],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    // unoptimized: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,
  poweredByHeader: false,

  experimental: {
    cssChunking: "strict",
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "antd",
      "@/components",
      "@/(dashbord)/manage/_components",
      "@/lib",
    ],
    webpackBuildWorker: true,

    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins: [
        "http://localhost:3000",
        "https://togruleminov.site",
        "https://*.togruleminov.site",
      ],
    },

    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  staticPageGenerationTimeout: 180,
  transpilePackages: ["leaflet", "react-leaflet"],

  webpack: (config, { isServer, dev }) => {
    // Server-side: exclude browser-only libs
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        leaflet: false,
        "react-leaflet": false,
      };
    } else {
      // Client-side: resolve leaflet
      config.resolve.alias = {
        ...config.resolve.alias,
        leaflet: require.resolve("leaflet"),
      };

      // Polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        canvas: false,
      };
    }

    // ✅ CSS loader - yalnız leaflet üçün
    if (!isServer) {
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /node_modules\/leaflet.*\.css$/,
        use: ["style-loader", "css-loader"],
      });
    }

    // Optimization
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            leaflet: {
              test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
              name: "leaflet",
              priority: 10,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              priority: 5,
              minChunks: 1,
            },
            common: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  async headers() {
    return [
      // ✅ Global headers - daha spesifik pattern
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // API Routes - No cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      // XML files
      {
        source: "/:path*.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Manifest
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      // Static assets
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Images
      {
        source: "/:path*\\.(png|jpg|jpeg|gif|webp|avif|ico|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Fonts
      {
        source: "/:path*\\.(woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Next.js static files
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
});

export default withNextIntl(nextConfig);
