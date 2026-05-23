import { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-defaults';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout',
          '/cart',
          '/account/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
