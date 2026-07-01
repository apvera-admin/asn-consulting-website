import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.asnconsulting.co';

  const routes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: '',                        priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/done-for-you-services',  priority: 0.9, changeFrequency: 'weekly'  },
    { path: '/services/diy',           priority: 0.9, changeFrequency: 'weekly'  },
    { path: '/private-trusts',         priority: 0.8, changeFrequency: 'weekly'  },
    { path: '/tax-remedy-services',    priority: 0.8, changeFrequency: 'weekly'  },
    { path: '/thank-you',              priority: 0.3, changeFrequency: 'monthly' },
    { path: '/login',                  priority: 0.4, changeFrequency: 'monthly' },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
