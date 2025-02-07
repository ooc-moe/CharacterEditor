/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.catbox.moe',
      },
    ],
  },
};
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}
export default withNextIntl(nextConfig);
