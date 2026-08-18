/**
 * Eternal Paws Platform - SEO & Structured Data Engine
 * Path: src/lib/seo.ts
 * 
 * Provides centralized generation for Schema.org JSON-LD (NewsArticle, BreadcrumbList, WebSite, Organization),
 * Next.js App Router Metadata, canonical URL normalization, and reading analytics.
 * 
 * Requirements: ORIGINAL_REQUEST § R2, Criteria; PROJECT.md F12, F16
 */

import type { Metadata } from 'next';
import { Story, StoryCategory, CATEGORIES_CONFIG } from '@/domain/types';

export const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-paws.com';
export const SITE_NAME = 'Eternal Paws';
export const DEFAULT_OG_IMAGE = `${DEFAULT_BASE_URL}/brand/og-default.png`;
export const PUBLISHER_LOGO_URL = `${DEFAULT_BASE_URL}/brand/logo.png`;

export const CATEGORY_SEO_MAP: Record<StoryCategory, { label: string; title: string; description: string; slug: string }> = {
  'reunions': {
    label: 'Heartfelt Reunions',
    slug: 'reunions',
    title: 'Dog Reunions — True Miraculous Return Stories',
    description: 'Remarkable true stories of lost dogs making miraculous journeys back to their families, verified through official microchip and shelter records.'
  },
  'hero-dogs': {
    label: 'Hero Dogs',
    slug: 'hero-dogs',
    title: 'Hero Dogs — True Stories of Canine Bravery & Rescue',
    description: 'Incredible accounts of canine bravery, search and rescue triumphs, and lives saved by extraordinary dogs in extreme situations.'
  },
  'rescues': {
    label: 'Rescue & Recovery',
    slug: 'rescues',
    title: 'Rescue Stories — True Canine Transformations & Recovery',
    description: 'Inspiring transformations of neglected, injured, or abandoned dogs finding unconditional love and second chances.'
  },
  'survival': {
    label: 'Against All Odds',
    slug: 'survival',
    title: 'Survival Dogs — True Stories of Resilience & Endurance',
    description: 'True survival tales of dogs enduring natural disasters, harsh wilderness, and extreme peril against all odds.'
  },
  'loyalty': {
    label: 'Unwavering Loyalty',
    slug: 'loyalty',
    title: 'Loyalty Stories — True Tales of Canine Devotion',
    description: 'Timeless testaments to the extraordinary bond, devotion, and lifelong fidelity of dogs who never gave up.'
  },
  'lost-and-found': {
    label: 'Lost & Found Journeys',
    slug: 'lost-and-found',
    title: 'Lost & Found — Community Searches & Found Dog Miracles',
    description: 'Community-powered discoveries, microchip miracles, and reunions against impossible odds across the nation.'
  }
};

/**
 * Normalizes a raw URL into a clean canonical URL:
 * - Removes query strings and hash fragments
 * - Removes trailing slashes (except root)
 * - Normalizes pathname to lowercase
 */
export function normalizeCanonicalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.search = '';
    parsed.hash = '';
    let pathname = parsed.pathname.toLowerCase();
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    // If not a full URL, strip query and hash manually
    let clean = rawUrl.split('?')[0].split('#')[0].trim();
    if (clean.length > 1 && clean.endsWith('/')) {
      clean = clean.slice(0, -1);
    }
    return clean;
  }
}

/**
 * Calculates reading time in minutes with a safe minimum of 1 minute.
 * Standard rate: ~200 words per minute.
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content || typeof content !== 'string') return 1;
  let words = 0;
  let inWord = false;
  const len = content.length;
  for (let i = 0; i < len; i++) {
    const code = content.charCodeAt(i);
    if (code > 32) {
      if (!inWord) {
        words++;
        inWord = true;
      }
    } else {
      inWord = false;
    }
  }
  if (words === 0) return 1;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Calculates scroll reading progress clamped strictly between 0% and 100%.
 * Supports both:
 * 1) 4-arg signature: calculateReadingProgress(scrollTop, contentTop, contentHeight, viewportHeight)
 * 2) 3-arg signature: calculateReadingProgress(scrollTop, scrollHeight, clientHeight)
 */
export function calculateReadingProgress(
  scrollTop: number,
  arg2: number,
  arg3: number,
  arg4?: number
): number {
  if (arg4 !== undefined) {
    // 4-arg signature: scrollTop, contentTop, contentHeight, viewportHeight
    const contentTop = arg2;
    const contentHeight = arg3;
    const viewportHeight = arg4;

    if (contentHeight <= 0) return 100;
    const totalScrollable = contentHeight - viewportHeight;
    if (totalScrollable <= 0) return 100;

    const currentScrolled = scrollTop - contentTop;
    if (currentScrolled <= 0) return 0;
    if (currentScrolled >= totalScrollable) return 100;

    const percentage = (currentScrolled / totalScrollable) * 100;
    return Math.min(100, Math.max(0, Math.round(percentage)));
  } else {
    // 3-arg signature: scrollTop, scrollHeight, clientHeight
    const scrollHeight = arg2;
    const clientHeight = arg3;

    if (scrollHeight <= 0 || clientHeight <= 0) return 100;
    const maxScrollable = scrollHeight - clientHeight;
    if (maxScrollable <= 0) return 100;

    if (scrollTop <= 0) return 0;
    if (scrollTop >= maxScrollable) return 100;

    const percentage = (scrollTop / maxScrollable) * 100;
    return Math.min(100, Math.max(0, Math.round(percentage)));
  }
}

// ============================================================================
// Next.js App Router Metadata Helpers
// ============================================================================

/**
 * Generates Next.js App Router Metadata for an individual story article.
 */
export function generateStoryMetadata(story: Story, options?: { baseUrl?: string }): Metadata {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const canonicalUrl = `${baseUrl}/stories/${story.slug}`;
  const heroImg = story.heroImage;
  const keywords = [
    story.dogName,
    story.dogBreed,
    story.category,
    `${story.location.city}, ${story.location.stateOrProvince}`,
    ...story.emotionalThemes,
    'verified dog story',
    'true pet story'
  ];

  const otherMeta: Record<string, string> = {
    'dog-name': story.dogName,
    'dog-breed': story.dogBreed,
    'dog-location': `${story.location.city}, ${story.location.stateOrProvince}, ${story.location.country}`,
    'verification-status': story.verification.status,
    'verification-score': String(story.verification.confidenceScore),
  };

  if (heroImg?.aiDisclosure?.isAiGenerated) {
    otherMeta['ai-disclosure'] = 'true';
    otherMeta['ai-tool'] = heroImg.aiDisclosure.aiToolUsed || 'Generative AI';
    otherMeta['ai-rationale'] = heroImg.aiDisclosure.reconstructionRationale || 'Visual reconstruction';
  }

  const imageUrl = heroImg?.url || `${baseUrl}/brand/og-default.png`;

  return {
    title: story.title,
    description: story.excerpt,
    keywords,
    authors: [{ name: 'Eternal Paws Editorial Team', url: baseUrl }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: story.title,
      description: story.excerpt,
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt || story.publishedAt,
      authors: ['Eternal Paws Editorial Team'],
      section: story.category,
      tags: [story.dogBreed, story.category, ...story.emotionalThemes],
      images: [
        {
          url: imageUrl,
          width: heroImg?.width || 1200,
          height: heroImg?.height || 675,
          alt: heroImg?.altText || story.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.excerpt,
      images: [imageUrl],
    },
    other: otherMeta,
  };
}

/**
 * Generates Next.js App Router Metadata for category hub pages.
 */
export function generateCategoryMetadata(category: StoryCategory, options?: { baseUrl?: string }): Metadata {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const config = CATEGORY_SEO_MAP[category] || {
    label: category,
    slug: category,
    title: `${category.toUpperCase()} Stories — Eternal Paws`,
    description: `Verified true stories in the ${category} category.`
  };
  const canonicalUrl = `${baseUrl}/${config.slug}`;
  const ogImg = `${baseUrl}/brand/og-default.png`;

  return {
    title: config.title,
    description: config.description,
    keywords: [config.label, 'dog stories', 'verified pet stories', category],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: config.title,
      description: config.description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: config.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImg],
    },
  };
}

/**
 * Generates Metadata for static editorial and hub pages (/about, /editorial-policy, etc.)
 */
export function generateHubMetadata(
  hub: { title: string; description: string; path: string; keywords?: string[]; imageUrl?: string },
  options?: { baseUrl?: string }
): Metadata {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const cleanPath = hub.path.startsWith('/') ? hub.path : `/${hub.path}`;
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  const imgUrl = hub.imageUrl || `${baseUrl}/brand/og-default.png`;

  return {
    title: hub.title,
    description: hub.description,
    keywords: hub.keywords || ['Eternal Paws', 'editorial policy', 'dog stories', 'fact-checking'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: hub.title,
      description: hub.description,
      images: [{ url: imgUrl, width: 1200, height: 630, alt: hub.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.title,
      description: hub.description,
      images: [imgUrl],
    },
  };
}

// ============================================================================
// Schema.org JSON-LD Structured Data Generators
// ============================================================================

/**
 * Generates NewsArticle JSON-LD structured data adhering to Schema.org standards.
 */
export function generateNewsArticleJsonLd(story: Story, baseUrl: string = DEFAULT_BASE_URL): Record<string, any> {
  const canonicalUrl = `${baseUrl}/stories/${story.slug}`;
  const heroImgUrl = story.heroImage?.url || `${baseUrl}/brand/og-default.png`;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: story.title,
    alternativeHeadline: story.subtitle,
    description: story.excerpt,
    image: [heroImgUrl],
    datePublished: story.publishedAt,
    dateModified: story.updatedAt || story.publishedAt,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: 'Eternal Paws Editorial Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/brand/logo.png`,
        width: 600,
        height: 60,
      },
    },
    about: {
      '@type': 'Thing',
      name: `${story.dogName} (${story.dogBreed})`,
      description: `${story.dogBreed} in ${story.location.city}, ${story.location.stateOrProvince}`,
    },
    articleSection: story.category,
    keywords: [story.dogName, story.dogBreed, story.category, ...story.emotionalThemes].join(', '),
  };

  // If the hero image is an AI visual reconstruction, attach explicit disclosure metadata
  if (
    story.heroImage?.licenseType === 'ai_visual_reconstruction' ||
    story.heroImage?.aiDisclosure?.isAiGenerated
  ) {
    schema.isBasedOn = {
      '@type': 'CreativeWork',
      name: 'Verified Editorial Case Blueprint & Incident Records',
      description: story.heroImage?.aiDisclosure?.reconstructionRationale || 'Visual reconstruction created from verified source logs.',
      creator: {
        '@type': 'Organization',
        name: 'Eternal Paws Editorial Lab',
      },
    };
  }

  return schema;
}

/**
 * Generates BreadcrumbList JSON-LD structured data.
 */
export function generateBreadcrumbJsonLd(
  crumbs: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generates WebSite JSON-LD structured data with Sitelinks SearchBox.
 */
export function generateWebSiteJsonLd(baseUrl: string = DEFAULT_BASE_URL): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    name: SITE_NAME,
    description: 'Verified true emotional dog stories built on trust and 4-tier fact-checking.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates Organization JSON-LD structured data for Eternal Paws.
 */
export function generateOrganizationJsonLd(baseUrl: string = DEFAULT_BASE_URL): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: baseUrl,
    logo: `${baseUrl}/brand/logo.png`,
    sameAs: [
      'https://twitter.com/EternalPawsMedia',
      'https://facebook.com/EternalPawsStories',
      'https://instagram.com/EternalPawsOfficial',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial and fact-checking corrections',
      email: 'corrections@eternal-paws.com',
      url: `${baseUrl}/corrections`,
    },
  };
}

/**
 * Serializes JSON-LD structured data safely for Next.js script embedding.
 * Prevents HTML/script breakout by escaping '<' characters.
 */
export function serializeJsonLd(data: Record<string, any>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
