
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/upload",
        destination: `${process.env.BACKEND_API_URL ?? "http://fastapi:8000"}/upload`,
      },
      {
        source: "/update-model",
        destination: `${process.env.BACKEND_API_URL ?? "http://fastapi:8000"}/update-model`,
      }
    ];
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Content-Length',
            value: '5000000000', // 1GB
          },
        ],
      },
    ];
  },
};

export default config;
