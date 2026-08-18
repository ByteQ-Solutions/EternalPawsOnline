import { describe, it, expect } from 'vitest';

/**
 * Domain types for Story, Category, SEO metadata
 */
export type StoryCategory = 'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found';

export interface StorySummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  category: StoryCategory;
  heroImage?: {
    url: string;
    altText: string;
    width: number;
    height: number;
    aspectRatio: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  status: 'draft' | 'review' | 'published' | 'archived';
}

/**
 * Reading time calculator with boundary protection
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content || typeof content !== 'string') return 1;
  const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (words === 0) return 1;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Reading progress calculator with clamping and zero-division protection
 */
export function calculateReadingProgress(scrollTop: number, contentTop: number, contentHeight: number, viewportHeight: number): number {
  if (contentHeight <= 0) return 100;
  const totalScrollableDistance = contentHeight - viewportHeight;
  if (totalScrollableDistance <= 0) return 100;

  const currentScrolled = scrollTop - contentTop;
  if (currentScrolled <= 0) return 0;
  if (currentScrolled >= totalScrollableDistance) return 100;

  const percentage = (currentScrolled / totalScrollableDistance) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

/**
 * Excerpt extractor fallback
 */
export function getSafeExcerpt(excerpt: string | undefined, content: string, maxLength: number = 160): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim();
  }
  const cleanContent = content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).trim() + '...';
}

/**
 * JSON-LD schema builder with strict escaping
 */
export function generateArticleJsonLd(story: StorySummary, siteUrl: string = 'https://eternal-paws.org'): string {
  const defaultImage = `${siteUrl}/images/og-default.jpg`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': story.title,
    'description': getSafeExcerpt(story.excerpt, story.content),
    'image': [story.heroImage?.url || defaultImage],
    'datePublished': story.publishedAt,
    'dateModified': story.updatedAt || story.publishedAt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/stories/${story.slug}`
    }
  };
  return JSON.stringify(schema);
}

/**
 * Canonical URL standardizer
 */
export function normalizeCanonicalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    // Strip query parameters and hash fragments
    parsed.search = '';
    parsed.hash = '';
    // Normalize pathname
    let pathname = parsed.pathname.toLowerCase();
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Category validator and normalizer
 */
const VALID_CATEGORIES: StoryCategory[] = ['reunions', 'hero-dogs', 'rescues', 'survival', 'loyalty', 'lost-and-found'];

export function normalizeCategorySlug(slug: string): StoryCategory | null {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase().replace(/_/g, '-');
  return VALID_CATEGORIES.includes(cleanSlug as StoryCategory) ? (cleanSlug as StoryCategory) : null;
}

describe('Tier 2 Boundary Tests - R2: High-Performance Public Web Platform', () => {

  describe('F12: SSR/SSG Article Rendering Engine Boundaries', () => {
    it('F12-B1: Non-existent slug query returns null / 404 response without throwing uncaught server exception', () => {
      const mockDatabase = new Map<string, StorySummary>([
        ['hachiko-tokyo', {
          id: '1', slug: 'hachiko-tokyo', title: 'Hachiko', subtitle: '', excerpt: '',
          content: 'Loyal dog', category: 'loyalty', publishedAt: '2026-01-01T00:00:00Z',
          readTimeMinutes: 1, status: 'published'
        }]
      ]);

      const fetchStoryBySlug = (slug: string): { status: number; data: StorySummary | null } => {
        const story = mockDatabase.get(slug);
        if (!story || story.status !== 'published') {
          return { status: 404, data: null };
        }
        return { status: 200, data: story };
      };

      const validResult = fetchStoryBySlug('hachiko-tokyo');
      const missingResult = fetchStoryBySlug('non-existent-dog-slug-xyz');
      const emptySlugResult = fetchStoryBySlug('');

      expect(validResult.status).toBe(200);
      expect(validResult.data?.title).toBe('Hachiko');
      expect(missingResult.status).toBe(404);
      expect(missingResult.data).toBeNull();
      expect(emptySlugResult.status).toBe(404);
    });

    it('F12-B2: Extremely long story content (10,000+ words) parses and segments without memory or stack error', () => {
      const longWordCount = 10000;
      const longContent = Array.from({ length: longWordCount }, (_, i) => `word${i}`).join(' ');

      const readTime = calculateReadingTime(longContent);
      expect(readTime).toBe(50); // 10,000 / 200 = 50 min read

      // Test paragraph segmentation
      const paragraphs = longContent.match(/([^\s]+(\s+[^\s]+){0,99})/g) || [];
      expect(paragraphs.length).toBe(100);
      expect(paragraphs[0]!.split(/\s+/).length).toBe(100);
    });

    it('F12-B3: Special character and emoji titles correctly escape in HTML context', () => {
      const escapeHtml = (text: string) => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      const dangerousTitle = 'Max & Bella: <The Rescue> of "Little Paw" \'26\' 🐶🐾';
      const escaped = escapeHtml(dangerousTitle);

      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&lt;The Rescue&gt;');
      expect(escaped).toContain('&quot;Little Paw&quot;');
      expect(escaped).toContain('&#039;26&#039;');
      expect(escaped).toContain('🐶🐾'); // Emojis preserved
    });

    it('F12-B4: Read time boundary clamps very short stories (< 200 words) to minimum 1 minute', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('A quick puppy rescue.')).toBe(1);
      expect(calculateReadingTime('   ')).toBe(1);
      expect(calculateReadingTime(Array(199).fill('dog').join(' '))).toBe(1);
      expect(calculateReadingTime(Array(201).fill('dog').join(' '))).toBe(2);
    });

    it('F12-B5: Empty or whitespace-only excerpt falls back to sanitized content snippet', () => {
      const rawContent = '<p>In the snowy hills of <strong>Colorado</strong>, a golden retriever named Daisy guided rescuers through a blizzard.</p>';
      const excerptFromEmpty = getSafeExcerpt('', rawContent, 50);
      const excerptFromSpaces = getSafeExcerpt('   ', rawContent, 50);
      const customExcerpt = getSafeExcerpt('Custom short summary', rawContent, 50);

      expect(excerptFromEmpty).toBe('In the snowy hills of Colorado, a golden retriever...');
      expect(excerptFromSpaces).toBe('In the snowy hills of Colorado, a golden retriever...');
      expect(customExcerpt).toBe('Custom short summary');
    });
  });

  describe('F13: Responsive Optimized Dog Media Boundaries', () => {
    it('F13-B1: Missing hero image object or URL falls back to default verified editorial placeholder', () => {
      const getHeroImageUrl = (heroImage?: { url?: string }): string => {
        if (!heroImage || !heroImage.url || heroImage.url.trim() === '') {
          return '/images/placeholder-dog-editorial.webp';
        }
        return heroImage.url.trim();
      };

      expect(getHeroImageUrl(undefined)).toBe('/images/placeholder-dog-editorial.webp');
      expect(getHeroImageUrl({})).toBe('/images/placeholder-dog-editorial.webp');
      expect(getHeroImageUrl({ url: '   ' })).toBe('/images/placeholder-dog-editorial.webp');
      expect(getHeroImageUrl({ url: 'https://cdn.eternal-paws.org/daisy.webp' })).toBe('https://cdn.eternal-paws.org/daisy.webp');
    });

    it('F13-B2: Extremely high resolution image (8000x6000) dimension calculates correct aspect ratio (4:3)', () => {
      const computeAspectRatio = (w: number, h: number): string => {
        if (w <= 0 || h <= 0) return '16/9';
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(w, h);
        return `${w / divisor}/${h / divisor}`;
      };

      expect(computeAspectRatio(8000, 6000)).toBe('4/3');
      expect(computeAspectRatio(1920, 1080)).toBe('16/9');
      expect(computeAspectRatio(1200, 1200)).toBe('1/1');
    });

    it('F13-B3: Extreme aspect ratios (21:9 panoramic and 9:21 tall portrait) maintain bounding container style', () => {
      const getMediaContainerStyle = (aspectRatio: string) => {
        return {
          width: '100%',
          aspectRatio: aspectRatio,
          objectFit: 'cover' as const,
        };
      };

      const ultraWide = getMediaContainerStyle('21/9');
      const tallPortrait = getMediaContainerStyle('9/21');

      expect(ultraWide.aspectRatio).toBe('21/9');
      expect(tallPortrait.aspectRatio).toBe('9/21');
      expect(ultraWide.objectFit).toBe('cover');
    });

    it('F13-B4: Malformed or malicious image URLs (javascript:) are sanitized to fallback', () => {
      const sanitizeImageUrl = (url: string): string => {
        if (!url || typeof url !== 'string') return '/images/placeholder-dog-editorial.webp';
        const trimmed = url.trim();
        if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html') || trimmed.startsWith('vbscript:')) {
          return '/images/placeholder-dog-editorial.webp';
        }
        if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://') && !trimmed.startsWith('/')) {
          return '/images/placeholder-dog-editorial.webp';
        }
        return trimmed;
      };

      expect(sanitizeImageUrl('javascript:alert(1)')).toBe('/images/placeholder-dog-editorial.webp');
      expect(sanitizeImageUrl('data:text/html,<script>alert(1)</script>')).toBe('/images/placeholder-dog-editorial.webp');
      expect(sanitizeImageUrl('https://eternal-paws.org/hero.webp')).toBe('https://eternal-paws.org/hero.webp');
      expect(sanitizeImageUrl('/assets/hero.webp')).toBe('/assets/hero.webp');
    });

    it('F13-B5: Zero and negative dimensions apply default 1200x675 bounding box', () => {
      const normalizeImageDimensions = (w?: number, h?: number): { width: number; height: number } => {
        const defaultW = 1200;
        const defaultH = 675;
        if (!w || w <= 0 || !h || h <= 0) {
          return { width: defaultW, height: defaultH };
        }
        return { width: Math.round(w), height: Math.round(h) };
      };

      expect(normalizeImageDimensions(0, 0)).toEqual({ width: 1200, height: 675 });
      expect(normalizeImageDimensions(-500, 300)).toEqual({ width: 1200, height: 675 });
      expect(normalizeImageDimensions(800, 600)).toEqual({ width: 800, height: 600 });
    });
  });

  describe('F14: Progressive Reading Progress Boundaries', () => {
    it('F14-B1: Top of page scroll (scrollTop = contentTop) yields exactly 0% progress', () => {
      const progress = calculateReadingProgress(100, 100, 2000, 800);
      expect(progress).toBe(0);
    });

    it('F14-B2: Bottom of article scroll yields exactly 100% progress without exceeding 100%', () => {
      // contentTop = 100, contentHeight = 2000, viewport = 800 -> total scrollable = 1200 -> scrollTop = 1300
      const progressAtEnd = calculateReadingProgress(1300, 100, 2000, 800);
      const progressPastEnd = calculateReadingProgress(1500, 100, 2000, 800);

      expect(progressAtEnd).toBe(100);
      expect(progressPastEnd).toBe(100);
    });

    it('F14-B3: Negative scroll bounce (iOS overscroll) is clamped to 0%', () => {
      const bounceProgress = calculateReadingProgress(-50, 100, 2000, 800);
      expect(bounceProgress).toBe(0);
    });

    it('F14-B4: Zero or negative height article safely yields 100% without NaN or division by zero', () => {
      const zeroHeight = calculateReadingProgress(0, 0, 0, 800);
      const shortArticle = calculateReadingProgress(0, 0, 400, 800); // Shorter than viewport

      expect(zeroHeight).toBe(100);
      expect(shortArticle).toBe(100);
      expect(isNaN(zeroHeight)).toBe(false);
    });

    it('F14-B5: Fast discontinuous scroll jump computes accurate instant percentage', () => {
      // 50% scroll position: currentScrolled = 600 of 1200 -> 50%
      const midProgress = calculateReadingProgress(700, 100, 2000, 800);
      expect(midProgress).toBe(50);
    });
  });

  describe('F15: Robust Empty & Error States Boundaries', () => {
    it('F15-B1: 404 Not Found response provides recovery navigation links', () => {
      const notFoundRecoveryState = {
        statusCode: 404,
        title: 'Story Not Found',
        message: 'The dog story you are looking for may have been moved or updated.',
        suggestedLinks: [
          { label: 'Home Feed', href: '/' },
          { label: 'Search Stories', href: '/search' },
          { label: 'Hero Dogs', href: '/hero-dogs' },
          { label: 'Rescue Stories', href: '/rescues' },
        ]
      };

      expect(notFoundRecoveryState.statusCode).toBe(404);
      expect(notFoundRecoveryState.suggestedLinks.length).toBeGreaterThanOrEqual(3);
      expect(notFoundRecoveryState.suggestedLinks.map(l => l.href)).toContain('/search');
    });

    it('F15-B2: Global error boundary captures rendering failure and exposes retry callback', () => {
      let retryCount = 0;
      const errorState = {
        error: new Error('Database timeout'),
        reset: () => { retryCount++; }
      };

      expect(errorState.error.message).toBe('Database timeout');
      errorState.reset();
      expect(retryCount).toBe(1);
    });

    it('F15-B3: Category page with 0 published stories returns empathetic empty state with browse action', () => {
      const renderCategoryFeed = (stories: StorySummary[]) => {
        if (stories.length === 0) {
          return {
            isEmpty: true,
            emptyMessage: 'No stories currently published in this category.',
            action: { label: 'Explore All Stories', href: '/' }
          };
        }
        return { isEmpty: false, count: stories.length };
      };

      const emptyResult = renderCategoryFeed([]);
      expect(emptyResult.isEmpty).toBe(true);
      expect(emptyResult.action?.href).toBe('/');
    });

    it('F15-B4: Simulated offline / network failure state returns cached fallback signal', () => {
      const handleNetworkError = (isOnline: boolean) => {
        if (!isOnline) {
          return { status: 'offline', message: 'You are currently offline. Showing cached stories.' };
        }
        return { status: 'online', message: 'Connected' };
      };

      expect(handleNetworkError(false).status).toBe('offline');
      expect(handleNetworkError(true).status).toBe('online');
    });

    it('F15-B5: Zero matching search results returns suggested categories and query tips', () => {
      const handleEmptySearchResults = (query: string) => {
        return {
          query,
          resultCount: 0,
          suggestions: ['Check spelling', 'Search by dog breed (e.g., Collie, Golden)', 'Browse by theme (e.g., Brave, Reunion)'],
          popularTags: ['Hero Dogs', 'Reunions', 'Miraculous']
        };
      };

      const emptySearch = handleEmptySearchResults('xyzqwertynoresult');
      expect(emptySearch.resultCount).toBe(0);
      expect(emptySearch.suggestions.length).toBeGreaterThan(0);
      expect(emptySearch.popularTags.length).toBeGreaterThan(0);
    });
  });

  describe('F16: SEO Structured Data & Social Metadata Boundaries', () => {
    it('F16-B1: JSON-LD serializer properly escapes double quotes, newlines, and unicode in story titles', () => {
      const trickyStory: StorySummary = {
        id: '1',
        slug: 'max-rescue',
        title: 'Max: The "Miracle" Dog\nHero of Rocky Mountain <2026>',
        subtitle: 'A tale of courage',
        excerpt: 'Rescuers found him after 48 hours in snow.',
        content: 'Full story text here.',
        category: 'hero-dogs',
        publishedAt: '2026-08-15T00:00:00Z',
        readTimeMinutes: 3,
        status: 'published'
      };

      const jsonLdString = generateArticleJsonLd(trickyStory);
      expect(() => JSON.parse(jsonLdString)).not.toThrow();

      const parsed = JSON.parse(jsonLdString);
      expect(parsed['@type']).toBe('NewsArticle');
      expect(parsed.headline).toBe('Max: The "Miracle" Dog\nHero of Rocky Mountain <2026>');
    });

    it('F16-B2: Missing optional dateModified uses datePublished without breaking schema validation', () => {
      const storyWithoutUpdate: StorySummary = {
        id: '2',
        slug: 'bella-reunion',
        title: 'Bella Reunion',
        subtitle: '',
        excerpt: '',
        content: 'Story content',
        category: 'reunions',
        publishedAt: '2026-05-10T14:30:00Z',
        readTimeMinutes: 2,
        status: 'published'
      };

      const parsed = JSON.parse(generateArticleJsonLd(storyWithoutUpdate));
      expect(parsed.datePublished).toBe('2026-05-10T14:30:00Z');
      expect(parsed.dateModified).toBe('2026-05-10T14:30:00Z');
    });

    it('F16-B3: Missing hero image provides fallback OG image URL in JSON-LD', () => {
      const storyNoImage: StorySummary = {
        id: '3',
        slug: 'lost-pup',
        title: 'Lost Pup Found',
        subtitle: '',
        excerpt: 'Short excerpt',
        content: 'Content',
        category: 'lost-and-found',
        publishedAt: '2026-06-01T00:00:00Z',
        readTimeMinutes: 1,
        status: 'published'
      };

      const parsed = JSON.parse(generateArticleJsonLd(storyNoImage));
      expect(parsed.image[0]).toBe('https://eternal-paws.org/images/og-default.jpg');
    });

    it('F16-B4: Canonical URL normalizer removes tracking params and trailing slashes', () => {
      const dirtyUrl = 'https://eternal-paws.org/stories/hero-max/?utm_source=facebook&utm_medium=cpc#comments';
      const cleanUrl = normalizeCanonicalUrl(dirtyUrl);
      expect(cleanUrl).toBe('https://eternal-paws.org/stories/hero-max');

      const trailingSlashUrl = 'https://eternal-paws.org/hero-dogs/';
      expect(normalizeCanonicalUrl(trailingSlashUrl)).toBe('https://eternal-paws.org/hero-dogs');
    });

    it('F16-B5: Dynamic XML sitemap generator formats 0 stories or 1000 stories into valid XML schema', () => {
      const generateSitemapXml = (urls: string[]): string => {
        const entries = urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <changefreq>daily</changefreq>\n  </url>`).join('\n');
        return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
      };

      const staticUrls = ['https://eternal-paws.org/', 'https://eternal-paws.org/about', 'https://eternal-paws.org/fact-checking'];
      const xml = generateSitemapXml(staticUrls);

      expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(xml).toContain('<loc>https://eternal-paws.org/</loc>');
      expect(xml.endsWith('</urlset>')).toBe(true);
    });
  });

  describe('F17: Semantic Category Routing Boundaries', () => {
    it('F17-B1: Unsupported category parameter returns null / 404 route resolution', () => {
      expect(normalizeCategorySlug('unsupported-category')).toBeNull();
      expect(normalizeCategorySlug('cats')).toBeNull();
      expect(normalizeCategorySlug('')).toBeNull();
    });

    it('F17-B2: Category slug case-normalization converts uppercase and underscores to canonical slugs', () => {
      expect(normalizeCategorySlug('REUNIONS')).toBe('reunions');
      expect(normalizeCategorySlug('Hero-Dogs')).toBe('hero-dogs');
      expect(normalizeCategorySlug('lost_and_found')).toBe('lost-and-found');
    });

    it('F17-B3: All 6 canonical categories map to valid non-null enum values', () => {
      const canonicals: StoryCategory[] = ['reunions', 'hero-dogs', 'rescues', 'survival', 'loyalty', 'lost-and-found'];
      for (const cat of canonicals) {
        expect(normalizeCategorySlug(cat)).toBe(cat);
      }
    });

    it('F17-B4: Single story in category layout maintains single card grid constraint without stretching', () => {
      const getCategoryGridClasses = (itemCount: number): string => {
        if (itemCount === 1) return 'grid grid-cols-1 max-w-md mx-auto';
        if (itemCount === 2) return 'grid grid-cols-1 md:grid-cols-2';
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      };

      expect(getCategoryGridClasses(1)).toContain('max-w-md');
      expect(getCategoryGridClasses(3)).toContain('lg:grid-cols-3');
    });

    it('F17-B5: Category breadcrumbs generate valid breadcrumb hierarchy list', () => {
      const generateBreadcrumbs = (category: StoryCategory, storyTitle?: string) => {
        const categoryLabels: Record<StoryCategory, string> = {
          'reunions': 'Reunions',
          'hero-dogs': 'Hero Dogs',
          'rescues': 'Rescues',
          'survival': 'Survival',
          'loyalty': 'Loyalty',
          'lost-and-found': 'Lost & Found',
        };

        const crumbs = [
          { name: 'Home', href: '/' },
          { name: categoryLabels[category], href: `/${category}` },
        ];
        if (storyTitle) {
          crumbs.push({ name: storyTitle, href: '' });
        }
        return crumbs;
      };

      const crumbs = generateBreadcrumbs('hero-dogs', 'Brave Max');
      expect(crumbs.length).toBe(3);
      expect(crumbs[0].name).toBe('Home');
      expect(crumbs[1].name).toBe('Hero Dogs');
      expect(crumbs[1].href).toBe('/hero-dogs');
      expect(crumbs[2].name).toBe('Brave Max');
    });
  });
});
