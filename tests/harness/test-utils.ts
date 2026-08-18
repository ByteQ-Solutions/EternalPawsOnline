/**
 * Eternal Paws Platform - Test Utilities & Verification Helpers
 * 
 * Concrete assertion utilities for WCAG contrast, touch targets, verification calculus,
 * progressive reading progress, weighted fuzzy search, recommendation continuity,
 * CLS reservation geometry, 301 redirect cycle resolution, and CMS pre-publish gates.
 */

import {
  Story,
  SourceAttribution,
  SourceType,
  VerificationStatus,
  SearchFilter,
  SearchResult,
  AdSlotConfig,
  StoryCategory,
  EmotionalTheme,
  SubmissionPayload
} from './fixtures';

// ============================================================================
// 1. Color Contrast & WCAG 2.2 AA Calculation Utilities
// ============================================================================

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a 3-hex or 6-hex color code to RGB channel values (0-255).
 */
export function hexToRgb(hex: string): RgbColor {
  let cleanHex = hex.replace(/^#/, '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    throw new Error(`Invalid hex color string: "${hex}"`);
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Calculates relative luminance of an sRGB color per WCAG 2.1 / 2.2 specification.
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  const sRgb = [r / 255, g / 255, b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRgb[0] + 0.7152 * sRgb[1] + 0.0722 * sRgb[2];
}

/**
 * Computes the contrast ratio between two hex colors (1:1 to 21:1).
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);
  const lum1 = calculateLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const lum2 = calculateLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return parseFloat(ratio.toFixed(2));
}

/**
 * Checks if a color pair satisfies WCAG 2.2 AA standards (4.5:1 for normal text, 3:1 for large text / UI components).
 */
export function meetsWcagAA(fgHex: string, bgHex: string, isLargeText: boolean = false): boolean {
  const ratio = calculateContrastRatio(fgHex, bgHex);
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

/**
 * Checks if a color pair satisfies WCAG 2.2 AAA standards (7:1 for normal text, 4.5:1 for large text).
 */
export function meetsWcagAAA(fgHex: string, bgHex: string, isLargeText: boolean = false): boolean {
  const ratio = calculateContrastRatio(fgHex, bgHex);
  const threshold = isLargeText ? 4.5 : 7.0;
  return ratio >= threshold;
}

// ============================================================================
// 2. Touch Target & Layout Size Verification Helpers
// ============================================================================

export interface TouchTargetResult {
  valid: boolean;
  minDimension: number;
  widthPx: number;
  heightPx: number;
  areaPx: number;
  message: string;
}

/**
 * Verifies that an interactive element satisfies the minimum 44x44px touch target requirement.
 */
export function validateTouchTarget(widthPx: number, heightPx: number, minSize: number = 44): TouchTargetResult {
  const minDimension = Math.min(widthPx, heightPx);
  const valid = widthPx >= minSize && heightPx >= minSize;
  const areaPx = widthPx * heightPx;
  return {
    valid,
    minDimension,
    widthPx,
    heightPx,
    areaPx,
    message: valid 
      ? `Passes touch target requirement: ${widthPx}x${heightPx}px >= ${minSize}x${minSize}px`
      : `Fails touch target requirement: ${widthPx}x${heightPx}px is below ${minSize}x${minSize}px`
  };
}

// ============================================================================
// 3. Verification Calculus & Trust Engine Logic
// ============================================================================

export const SOURCE_WEIGHTS: Record<SourceType, { baseScore: number; isInstitutional: boolean }> = {
  'police': { baseScore: 35, isInstitutional: true },
  'official_agency': { baseScore: 35, isInstitutional: true },
  'court_record': { baseScore: 35, isInstitutional: true },
  'veterinary_clinic': { baseScore: 30, isInstitutional: true },
  'shelter': { baseScore: 25, isInstitutional: true },
  'news_outlet': { baseScore: 20, isInstitutional: false },
  'eyewitness': { baseScore: 15, isInstitutional: false }
};

export interface VerificationCalculusResult {
  status: VerificationStatus;
  confidenceScore: number;
  institutionalCount: number;
  communityCount: number;
  totalSources: number;
  reason: string;
}

/**
 * Deterministically computes verification level and confidence score from source attributions.
 * 
 * Rules:
 * - Institutional sources provide high base points (25-35 pts).
 * - News / eyewitness sources provide moderate base points (15-20 pts).
 * - Document references and URLs add +10 confidence boost per source.
 * - Score is capped at 100.
 * - Status determination:
 *   - 0 sources or score < 30 => 'Unverified'
 *   - 1 source or score 30..59 => 'Partially Verified'
 *   - 2+ sources with at least 1 institutional source (or score 60..84) => 'Verified'
 *   - 2+ institutional sources with score >= 85 => 'Strongly Verified'
 */
export function calculateVerificationLevel(
  sources: SourceAttribution[],
  options?: { hasAiDisclosure?: boolean; aiReconstruction?: boolean }
): VerificationCalculusResult {
  if (!sources || sources.length === 0) {
    return {
      status: 'Unverified',
      confidenceScore: 0,
      institutionalCount: 0,
      communityCount: 0,
      totalSources: 0,
      reason: 'No source attributions provided.'
    };
  }

  let totalScore = 0;
  let institutionalCount = 0;
  let communityCount = 0;

  for (const src of sources) {
    const weightInfo = SOURCE_WEIGHTS[src.type] || { baseScore: 10, isInstitutional: false };
    let srcScore = weightInfo.baseScore;

    if (weightInfo.isInstitutional) {
      institutionalCount++;
    } else {
      communityCount++;
    }

    if (src.documentReference && src.documentReference.trim().length > 0) {
      srcScore += 10;
    }
    if (src.url && src.url.startsWith('http')) {
      srcScore += 5;
    }

    totalScore += srcScore;
  }

  const confidenceScore = Math.min(100, Math.max(0, totalScore));

  let status: VerificationStatus = 'Unverified';
  let reason = '';

  if (institutionalCount >= 2 && confidenceScore >= 85) {
    status = 'Strongly Verified';
    reason = `Strongly verified with ${institutionalCount} institutional sources and confidence score ${confidenceScore}/100.`;
  } else if ((institutionalCount >= 1 && sources.length >= 2) || confidenceScore >= 60) {
    status = 'Verified';
    reason = `Verified with ${sources.length} sources (including ${institutionalCount} institutional) and confidence score ${confidenceScore}/100.`;
  } else if (sources.length >= 1 || confidenceScore >= 30) {
    status = 'Partially Verified';
    reason = `Partially verified with ${sources.length} preliminary source(s) and confidence score ${confidenceScore}/100.`;
  } else {
    status = 'Unverified';
    reason = `Unverified: insufficient source weighting (score ${confidenceScore}/100).`;
  }

  return {
    status,
    confidenceScore,
    institutionalCount,
    communityCount,
    totalSources: sources.length,
    reason
  };
}

// ============================================================================
// 4. Progressive Reading Progress Calculation
// ============================================================================

/**
 * Calculates article reading progress percentage (0-100) based on scroll offset and viewport heights.
 */
export function calculateReadingProgress(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  if (scrollHeight <= clientHeight || scrollHeight <= 0) {
    return 100;
  }
  const maxScrollable = scrollHeight - clientHeight;
  const progress = (scrollTop / maxScrollable) * 100;
  return Math.min(100, Math.max(0, parseFloat(progress.toFixed(1))));
}

// ============================================================================
// 5. Fuzzy Search & Relevance Scoring Helpers
// ============================================================================

/**
 * Computes Levenshtein edit distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Computes normalized string similarity (0.0 to 1.0) using Levenshtein distance.
 */
export function stringSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  const maxLen = Math.max(s1.length, s2.length);
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, (maxLen - dist) / maxLen);
}

/**
 * Multi-field weighted fuzzy matching:
 * - dog name: 1.0
 * - breed: 0.85
 * - location: 0.80
 * - category: 0.75
 * - theme: 0.70
 * - title / excerpt / content: 0.40
 */
export function calculateFuzzyMatchScore(query: string, story: Story): { score: number; matchedFields: string[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { score: 0, matchedFields: [] };

  let totalScore = 0;
  const matchedFields: string[] = [];

  // 1. Dog name (weight 1.0)
  const nameSim = stringSimilarity(q, story.dogName);
  if (nameSim >= 0.7 || story.dogName.toLowerCase().includes(q)) {
    totalScore += 1.0 * (story.dogName.toLowerCase().includes(q) ? 1.0 : nameSim);
    matchedFields.push('dogName');
  }

  // 2. Dog breed (weight 0.85)
  const breedSim = stringSimilarity(q, story.dogBreed);
  if (breedSim >= 0.7 || story.dogBreed.toLowerCase().includes(q)) {
    totalScore += 0.85 * (story.dogBreed.toLowerCase().includes(q) ? 1.0 : breedSim);
    matchedFields.push('dogBreed');
  }

  // 3. Location (weight 0.80)
  const locStr = `${story.location.city} ${story.location.stateOrProvince} ${story.location.country}`.toLowerCase();
  if (locStr.includes(q)) {
    totalScore += 0.80;
    matchedFields.push('location');
  }

  // 4. Category (weight 0.75)
  if (story.category.toLowerCase().includes(q) || stringSimilarity(q, story.category) >= 0.8) {
    totalScore += 0.75;
    matchedFields.push('category');
  }

  // 5. Emotional Themes (weight 0.70)
  for (const theme of story.emotionalThemes) {
    if (theme.toLowerCase().includes(q) || stringSimilarity(q, theme) >= 0.8) {
      totalScore += 0.70;
      matchedFields.push('emotionalThemes');
      break;
    }
  }

  // 6. Title / Excerpt / Content (weight 0.40)
  if (story.title.toLowerCase().includes(q) || story.excerpt.toLowerCase().includes(q)) {
    totalScore += 0.40;
    matchedFields.push('title/excerpt');
  }

  return {
    score: parseFloat(totalScore.toFixed(3)),
    matchedFields
  };
}

/**
 * Searches and filters stories in a corpus by fuzzy query and criteria filters.
 */
export function searchStoriesInCorpus(stories: Story[], filter: SearchFilter): SearchResult[] {
  let filtered = [...stories];

  if (filter.category) {
    filtered = filtered.filter(s => s.category === filter.category);
  }
  if (filter.emotionalTheme) {
    filtered = filtered.filter(s => s.emotionalThemes.includes(filter.emotionalTheme!));
  }
  if (filter.dogBreed) {
    const targetBreed = filter.dogBreed.toLowerCase();
    filtered = filtered.filter(s => s.dogBreed.toLowerCase().includes(targetBreed));
  }
  if (filter.location) {
    const targetLoc = filter.location.toLowerCase();
    filtered = filtered.filter(s => 
      s.location.city.toLowerCase().includes(targetLoc) ||
      s.location.stateOrProvince.toLowerCase().includes(targetLoc) ||
      s.location.country.toLowerCase().includes(targetLoc)
    );
  }
  if (filter.verificationStatus) {
    filtered = filtered.filter(s => s.verification.status === filter.verificationStatus);
  }

  if (!filter.query || filter.query.trim() === '') {
    return filtered.map(story => ({
      story,
      relevanceScore: story.featured ? 1.0 : 0.5,
      matchedFields: ['default']
    }));
  }

  const results: SearchResult[] = [];
  for (const story of filtered) {
    const match = calculateFuzzyMatchScore(filter.query, story);
    if (match.score > 0) {
      results.push({
        story,
        relevanceScore: match.score,
        matchedFields: match.matchedFields
      });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================================
// 6. Multi-Signal Related Story Continuity Engine
// ============================================================================

/**
 * Computes reading continuity recommendation score between two stories:
 * - Category affinity match (+0.4)
 * - Emotional theme Jaccard overlap (+0.3)
 * - Breed match (+0.2)
 * - Verification confidence weight bonus (+0.1 * confidence / 100)
 */
export function calculateRelatedStoryScore(current: Story, candidate: Story): number {
  if (current.id === candidate.id) return 0;

  let score = 0;

  // Category match
  if (current.category === candidate.category) {
    score += 0.40;
  }

  // Theme Jaccard similarity
  const set1 = new Set(current.emotionalThemes);
  const set2 = new Set(candidate.emotionalThemes);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;
  score += 0.30 * jaccard;

  // Breed affinity
  if (current.dogBreed.toLowerCase() === candidate.dogBreed.toLowerCase()) {
    score += 0.20;
  }

  // Trust bonus
  const trustBonus = (candidate.verification.confidenceScore / 100) * 0.10;
  score += trustBonus;

  return parseFloat(score.toFixed(3));
}

/**
 * Returns top-N related stories sorted by multi-signal continuity score.
 */
export function getRelatedStoriesFromCorpus(current: Story, corpus: Story[], limit: number = 3): Story[] {
  const scored = corpus
    .filter(s => s.id !== current.id && s.status === 'published')
    .map(story => ({
      story,
      score: calculateRelatedStoryScore(current, story)
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => item.story);
}

// ============================================================================
// 7. Monetization CLS & Safe Margin Calculations
// ============================================================================

export interface ClsReservationResult {
  minHeight: number;
  minWidth: number;
  aspectRatio: string;
  clsScoreImpact: number;
  isValid: boolean;
}

/**
 * Calculates CLS reservation layout bounding dimensions and confirms zero layout shift impact.
 */
export function calculateClsReservation(adConfig: AdSlotConfig): ClsReservationResult {
  const hasReservation = adConfig.minHeightPx > 0 && adConfig.minWidthPx > 0;
  const isValid = hasReservation && !!adConfig.aspectRatioReservation;
  
  // When explicit min-height and aspect-ratio reservations exist in DOM, CLS shift = 0.
  const clsScoreImpact = isValid ? 0.000 : 0.250;

  return {
    minHeight: adConfig.minHeightPx,
    minWidth: adConfig.minWidthPx,
    aspectRatio: adConfig.aspectRatioReservation,
    clsScoreImpact,
    isValid
  };
}

/**
 * Verifies safe margins around ad placements (>=32px top/bottom, >=48px CTA buffer).
 */
export function validateAdSafeMargins(adConfig: AdSlotConfig): { hasSafeTop: boolean; hasSafeBottom: boolean; hasCtaBuffer: boolean; isValid: boolean } {
  const hasSafeTop = adConfig.safeMarginTopPx >= 32;
  const hasSafeBottom = adConfig.safeMarginBottomPx >= 32;
  const hasCtaBuffer = adConfig.ctaBufferPx >= 48;
  return {
    hasSafeTop,
    hasSafeBottom,
    hasCtaBuffer,
    isValid: hasSafeTop && hasSafeBottom && hasCtaBuffer
  };
}

// ============================================================================
// 8. CMS Pre-Publish Checklist & 301 Redirect Resolver
// ============================================================================

export interface ChecklistGateResult {
  passed: boolean;
  checks: {
    altTextPresent: boolean;
    imageRightsDeclared: boolean;
    minimumOneSource: boolean;
    validSlugSyntax: boolean;
    seoTitleLengthValid: boolean;
    contentMinimumLength: boolean;
    categoryAssigned: boolean;
    emotionalThemeAssigned: boolean;
    verificationAttached: boolean;
  };
  missingFields: string[];
  totalChecks: number;
  passedCount: number;
}

/**
 * 9-point automated pre-publish checklist validator.
 */
export function runCmsPrePublishChecklist(story: Partial<Story>): ChecklistGateResult {
  const wordCount = story.content ? story.content.trim().split(/\s+/).length : 0;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  const checks = {
    altTextPresent: Boolean(story.heroImage?.altText && story.heroImage.altText.trim().length >= 10),
    imageRightsDeclared: Boolean(story.heroImage?.licenseType && story.heroImage?.credit),
    minimumOneSource: Boolean(story.verification?.sources && story.verification.sources.length >= 1),
    validSlugSyntax: Boolean(story.slug && slugRegex.test(story.slug)),
    seoTitleLengthValid: Boolean(story.title && story.title.length >= 15 && story.title.length <= 120),
    contentMinimumLength: wordCount >= 50,
    categoryAssigned: Boolean(story.category),
    emotionalThemeAssigned: Boolean(story.emotionalThemes && story.emotionalThemes.length >= 1),
    verificationAttached: Boolean(story.verification && story.verification.status)
  };

  const missingFields: string[] = [];
  if (!checks.altTextPresent) missingFields.push('heroImage.altText (min 10 chars)');
  if (!checks.imageRightsDeclared) missingFields.push('heroImage.licenseType & credit');
  if (!checks.minimumOneSource) missingFields.push('verification.sources (min 1 source)');
  if (!checks.validSlugSyntax) missingFields.push('slug (kebab-case alphanumeric)');
  if (!checks.seoTitleLengthValid) missingFields.push('title (15-120 chars)');
  if (!checks.contentMinimumLength) missingFields.push(`content word count (${wordCount} < 50 words)`);
  if (!checks.categoryAssigned) missingFields.push('category');
  if (!checks.emotionalThemeAssigned) missingFields.push('emotionalThemes');
  if (!checks.verificationAttached) missingFields.push('verification');

  const checkValues = Object.values(checks);
  const passedCount = checkValues.filter(Boolean).length;
  const passed = passedCount === checkValues.length;

  return {
    passed,
    checks,
    missingFields,
    totalChecks: checkValues.length,
    passedCount
  };
}

/**
 * Resolves 301 redirect chains and detects circular loops.
 */
export function resolveRedirect(
  initialSlug: string,
  redirectMap: Record<string, string> | Map<string, string>,
  maxHops: number = 10
): { finalSlug: string; hops: number; isCycle: boolean; chain: string[] } {
  const getTarget = (k: string) => redirectMap instanceof Map ? redirectMap.get(k) : redirectMap[k];
  
  let current = initialSlug;
  const chain: string[] = [current];
  const visited = new Set<string>([current]);
  let hops = 0;

  while (hops < maxHops) {
    const next = getTarget(current);
    if (!next) {
      break;
    }
    if (visited.has(next)) {
      chain.push(next);
      return {
        finalSlug: next,
        hops: hops + 1,
        isCycle: true,
        chain
      };
    }
    visited.add(next);
    chain.push(next);
    current = next;
    hops++;
  }

  return {
    finalSlug: current,
    hops,
    isCycle: hops >= maxHops,
    chain
  };
}

// ============================================================================
// 9. Structured Data JSON-LD & Validation Utilities
// ============================================================================

/**
 * Generates NewsArticle JSON-LD structured data for SEO.
 */
export function generateNewsArticleJsonLd(story: Story, baseUrl: string = 'https://eternal-paws.org'): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/stories/${story.slug}`
    },
    headline: story.title,
    description: story.excerpt,
    image: [story.heroImage.url],
    datePublished: story.publishedAt,
    dateModified: story.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Eternal Paws Editorial Team',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eternal Paws',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/brand/logo.png`
      }
    },
    about: {
      '@type': 'Thing',
      name: `${story.dogName} (${story.dogBreed})`
    }
  };
}

/**
 * Generates BreadcrumbList JSON-LD structured data.
 */
export function generateBreadcrumbJsonLd(crumbs: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

/**
 * RFC 5322 standard compliant email format validator.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Image upload constraint validator (5MB size limit, JPEG/PNG/WebP format).
 */
export function validateImageUpload(file: { name: string; sizeBytes: number; mimeType: string }): { valid: boolean; error?: string } {
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.sizeBytes > maxSizeBytes) {
    return {
      valid: false,
      error: `File size ${(file.sizeBytes / (1024 * 1024)).toFixed(2)}MB exceeds maximum allowed limit of 5.0MB.`
    };
  }

  if (!allowedMimeTypes.includes(file.mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported image format "${file.mimeType}". Allowed formats: JPEG, PNG, WebP.`
    };
  }

  return { valid: true };
}
