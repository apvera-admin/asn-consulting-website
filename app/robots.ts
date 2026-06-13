import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/auth/', '/admin/', '/reset-password', '/update-password'],
    },
    sitemap: 'https://www.asnconsulting.co/sitemap.xml',
  };
}
