/**
 * Eternal Paws Platform - Search Engine Crawler Directives
 * Path: app/robots.ts
 * 
 * Declares indexation rules, crawler boundaries, and canonical sitemap.
 * 
 * Requirements: ORIGINAL_REQUEST § Criteria; PROJECT.md F16
 */

import { MetadataRoute } from 'next';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL;

  let host: string | undefined;
  try {
    host = new URL(baseUrl).host;
  } catch {
    host = undefined;
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/drafts/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host,
  };
}
