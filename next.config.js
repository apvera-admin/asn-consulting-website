/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/signup', destination: '/login', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/blueprint', destination: '/services/diy', permanent: true },
      { source: '/diy-pricing', destination: '/services/diy', permanent: true },
      { source: '/post/why-would-i-correct-my-status', destination: '/blog', permanent: true },
      { source: '/post/where-the-fraud-begins', destination: '/blog', permanent: true },
      { source: '/post/what-does-the-paperwork-actually-do', destination: '/blog', permanent: true },
      { source: '/post/:slug*', destination: '/blog', permanent: true },
    ];
  },
};
module.exports = nextConfig;
