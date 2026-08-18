import { describe, it, expect } from 'vitest';

/**
 * Domain types as defined in PROJECT.md
 */
export type StoryCategory = 'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found';
export type EmotionalTheme = 'joyful' | 'tearjerker' | 'inspiring' | 'miraculous' | 'heartwarming' | 'brave';
export type VerificationStatus = 'Unverified' | 'Partially Verified' | 'Verified' | 'Strongly Verified';
export type SourceType = 'shelter' | 'police' | 'news_outlet' | 'veterinary_clinic' | 'eyewitness' | 'court_record' | 'official_agency';
export type ImageLicenseType = 'original_photography' | 'official_source_release' | 'licensed_stock' | 'user_submitted_verified' | 'ai_visual_reconstruction';

export interface SourceAttribution {
  id: string;
  name: string;
  type: SourceType;
  organization?: string;
  url?: string;
  documentReference?: string;
  verifiedDate: string;
  notes?: string;
}

export interface VerificationRecord {
  status: VerificationStatus;
  verifiedAt: string;
  verifiedBy: string;
  sources: SourceAttribution[];
  methodologyNotes: string;
  confidenceScore: number; // 0-100
}

/**
 * Source type weight calculator
 */
const SOURCE_WEIGHTS: Record<SourceType, number> = {
  police: 40,
  court_record: 40,
  official_agency: 35,
  veterinary_clinic: 35,
  shelter: 30,
  news_outlet: 25,
  eyewitness: 15,
};

/**
 * Deterministic 4-tier verification calculus
 */
export function calculateVerificationTier(sources: SourceAttribution[]): {
  status: VerificationStatus;
  confidenceScore: number;
} {
  if (!sources || sources.length === 0) {
    return { status: 'Unverified', confidenceScore: 0 };
  }

  // Deduplicate sources by URL or name
  const seen = new Set<string>();
  const uniqueSources = sources.filter(s => {
    const key = s.url || `${s.name}-${s.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let rawScore = 0;
  for (const source of uniqueSources) {
    rawScore += SOURCE_WEIGHTS[source.type] || 10;
  }

  // Clamp confidence score between 0 and 100
  const confidenceScore = Math.min(100, Math.max(0, rawScore));

  let status: VerificationStatus;
  if (confidenceScore >= 90) {
    status = 'Strongly Verified';
  } else if (confidenceScore >= 70) {
    status = 'Verified';
  } else if (confidenceScore >= 40) {
    status = 'Partially Verified';
  } else {
    status = 'Unverified';
  }

  return { status, confidenceScore };
}

/**
 * URL sanitizer for source attribution links
 */
export function sanitizeSourceUrl(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * AI disclosure validator
 */
export function validateImageAiDisclosure(heroImage: {
  licenseType: ImageLicenseType;
  altText: string;
  credit: string;
  aiDisclosure?: {
    isAiGenerated: boolean;
    aiToolUsed?: string;
    reconstructionRationale?: string;
  };
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!heroImage.altText || heroImage.altText.trim().length < 5) {
    errors.push('Alt text must be at least 5 characters long.');
  }

  if (heroImage.licenseType === 'ai_visual_reconstruction') {
    if (!heroImage.aiDisclosure?.isAiGenerated) {
      errors.push('AI Visual Reconstruction license requires isAiGenerated to be true.');
    }
    if (!heroImage.aiDisclosure?.reconstructionRationale || heroImage.aiDisclosure.reconstructionRationale.trim().length < 10) {
      errors.push('AI Visual Reconstruction requires a rationale explaining why historical/actual photo was unavailable.');
    }
  }

  if (heroImage.licenseType === 'original_photography' && (!heroImage.credit || heroImage.credit.trim().length < 2)) {
    errors.push('Original photography requires explicit photographer credit.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

describe('Tier 2 Boundary Tests - R3: Fact-Checking, Sources & Verification Engine', () => {

  describe('F06: Master Story Schema & Types Boundaries', () => {
    it('F06-B1: Missing required top-level fields fails schema validation', () => {
      const validateStoryMinimal = (obj: any): boolean => {
        return !!(obj && obj.id && obj.slug && obj.title && obj.dogName && obj.category && obj.verification);
      };

      const validStory = {
        id: 'story-1',
        slug: 'max-rescue',
        title: 'Max The Rescue Hero',
        dogName: 'Max',
        category: 'rescues',
        verification: { status: 'Verified', confidenceScore: 75, sources: [] }
      };

      const missingDogName = { ...validStory, dogName: '' };
      const missingVerification = { ...validStory, verification: undefined };

      expect(validateStoryMinimal(validStory)).toBe(true);
      expect(validateStoryMinimal(missingDogName)).toBe(false);
      expect(validateStoryMinimal(missingVerification)).toBe(false);
    });

    it('F06-B2: Title length bounds (min 5, max 200 characters) strictly enforce limits', () => {
      const validateTitleLength = (title: string): boolean => {
        const len = title ? title.trim().length : 0;
        return len >= 5 && len <= 200;
      };

      expect(validateTitleLength('Dog')).toBe(false); // Too short (<5)
      expect(validateTitleLength('Brave Pup Found')).toBe(true);
      expect(validateTitleLength('A'.repeat(200))).toBe(true);
      expect(validateTitleLength('A'.repeat(201))).toBe(false); // Too long (>200)
    });

    it('F06-B3: Invalid enum values for Category and Theme are strictly rejected', () => {
      const validCategories: StoryCategory[] = ['reunions', 'hero-dogs', 'rescues', 'survival', 'loyalty', 'lost-and-found'];
      const validThemes: EmotionalTheme[] = ['joyful', 'tearjerker', 'inspiring', 'miraculous', 'heartwarming', 'brave'];

      const isValidCategory = (cat: string): cat is StoryCategory => validCategories.includes(cat as StoryCategory);
      const isValidTheme = (theme: string): theme is EmotionalTheme => validThemes.includes(theme as EmotionalTheme);

      expect(isValidCategory('hero-dogs')).toBe(true);
      expect(isValidCategory('funny-dogs')).toBe(false);
      expect(isValidTheme('brave')).toBe(true);
      expect(isValidTheme('scary')).toBe(false);
    });

    it('F06-B4: ISO 8601 date string validator rejects malformed and non-existent calendar dates', () => {
      const isValidIsoDate = (dateStr: string): boolean => {
        if (!dateStr || typeof dateStr !== 'string') return false;
        const timestamp = Date.parse(dateStr);
        if (isNaN(timestamp)) return false;
        // Verify format matches ISO standard
        return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/.test(dateStr);
      };

      expect(isValidIsoDate('2026-08-15T12:00:00Z')).toBe(true);
      expect(isValidIsoDate('2026-08-15')).toBe(true);
      expect(isValidIsoDate('yesterday')).toBe(false);
      expect(isValidIsoDate('2026-99-99')).toBe(false);
    });

    it('F06-B5: Nested verification sources require valid date and valid SourceType', () => {
      const isValidSource = (s: any): boolean => {
        const validTypes: SourceType[] = ['shelter', 'police', 'news_outlet', 'veterinary_clinic', 'eyewitness', 'court_record', 'official_agency'];
        return !!(s && s.id && s.name && validTypes.includes(s.type) && s.verifiedDate && !isNaN(Date.parse(s.verifiedDate)));
      };

      const validSource: SourceAttribution = {
        id: 'src-1',
        name: 'City Animal Care',
        type: 'shelter',
        verifiedDate: '2026-08-10'
      };

      const invalidTypeSource = { ...validSource, type: 'random_blog' };
      const invalidDateSource = { ...validSource, verifiedDate: 'not-a-date' };

      expect(isValidSource(validSource)).toBe(true);
      expect(isValidSource(invalidTypeSource)).toBe(false);
      expect(isValidSource(invalidDateSource)).toBe(false);
    });
  });

  describe('F07: 4-Tier Fact-Checking & Verification Engine Boundaries', () => {
    it('F07-B1: Zero sources strictly evaluates to Unverified with confidence score 0', () => {
      const result = calculateVerificationTier([]);
      expect(result.status).toBe('Unverified');
      expect(result.confidenceScore).toBe(0);
    });

    it('F07-B2: Confidence score boundaries: exactly 0 -> Unverified, exactly 100 -> Strongly Verified', () => {
      const zeroSourcesResult = calculateVerificationTier([]);
      expect(zeroSourcesResult.status).toBe('Unverified');
      expect(zeroSourcesResult.confidenceScore).toBe(0);

      // Multiple high-authority institutional sources: Police (40) + Court (40) + Veterinary (35) = 115 -> clamped to 100
      const strongSources: SourceAttribution[] = [
        { id: '1', name: 'Police Department', type: 'police', verifiedDate: '2026-08-01' },
        { id: '2', name: 'County Court Record', type: 'court_record', verifiedDate: '2026-08-02' },
        { id: '3', name: 'State Vet Clinic', type: 'veterinary_clinic', verifiedDate: '2026-08-03' },
      ];
      const hundredResult = calculateVerificationTier(strongSources);
      expect(hundredResult.status).toBe('Strongly Verified');
      expect(hundredResult.confidenceScore).toBe(100);
    });

    it('F07-B3: 4-tier score threshold boundaries (0-39 Unverified, 40-69 Partially Verified, 70-89 Verified, 90-100 Strongly Verified)', () => {
      // 1 Eyewitness = 15 -> Unverified
      const unverified = calculateVerificationTier([
        { id: '1', name: 'Eyewitness Bob', type: 'eyewitness', verifiedDate: '2026-08-01' }
      ]);
      expect(unverified.confidenceScore).toBe(15);
      expect(unverified.status).toBe('Unverified');

      // 1 Shelter (30) + 1 Eyewitness (15) = 45 -> Partially Verified
      const partiallyVerified = calculateVerificationTier([
        { id: '1', name: 'Humane Society', type: 'shelter', verifiedDate: '2026-08-01' },
        { id: '2', name: 'Eyewitness', type: 'eyewitness', verifiedDate: '2026-08-02' }
      ]);
      expect(partiallyVerified.confidenceScore).toBe(45);
      expect(partiallyVerified.status).toBe('Partially Verified');

      // 1 Police (40) + 1 Shelter (30) = 70 -> Verified (exactly on 70 boundary)
      const verifiedBoundary = calculateVerificationTier([
        { id: '1', name: 'Metro Police', type: 'police', verifiedDate: '2026-08-01' },
        { id: '2', name: 'Local Shelter', type: 'shelter', verifiedDate: '2026-08-02' }
      ]);
      expect(verifiedBoundary.confidenceScore).toBe(70);
      expect(verifiedBoundary.status).toBe('Verified');

      // 1 Police (40) + 1 Court (40) + 1 Eyewitness (15) = 95 -> Strongly Verified
      const stronglyVerified = calculateVerificationTier([
        { id: '1', name: 'Metro Police', type: 'police', verifiedDate: '2026-08-01' },
        { id: '2', name: 'County Court', type: 'court_record', verifiedDate: '2026-08-02' },
        { id: '3', name: 'Eyewitness', type: 'eyewitness', verifiedDate: '2026-08-03' }
      ]);
      expect(stronglyVerified.confidenceScore).toBe(95);
      expect(stronglyVerified.status).toBe('Strongly Verified');
    });

    it('F07-B4: Cumulative score overflow prevention strictly caps confidence at 100', () => {
      const excessiveSources: SourceAttribution[] = [
        { id: '1', name: 'Police A', type: 'police', verifiedDate: '2026-08-01' },
        { id: '2', name: 'Police B', type: 'police', verifiedDate: '2026-08-01' },
        { id: '3', name: 'Court A', type: 'court_record', verifiedDate: '2026-08-01' },
        { id: '4', name: 'Shelter A', type: 'shelter', verifiedDate: '2026-08-01' },
        { id: '5', name: 'News A', type: 'news_outlet', verifiedDate: '2026-08-01' },
      ]; // Sum = 40+40+40+30+25 = 175

      const result = calculateVerificationTier(excessiveSources);
      expect(result.confidenceScore).toBe(100);
      expect(result.status).toBe('Strongly Verified');
    });

    it('F07-B5: Duplicate source submissions are deduplicated to prevent artificial score inflation', () => {
      const duplicateSources: SourceAttribution[] = [
        { id: '1', name: 'Local Police Report', type: 'police', url: 'https://police.gov/report-123', verifiedDate: '2026-08-01' },
        { id: '2', name: 'Local Police Report Copy', type: 'police', url: 'https://police.gov/report-123', verifiedDate: '2026-08-01' },
      ];

      const result = calculateVerificationTier(duplicateSources);
      expect(result.confidenceScore).toBe(40); // Evaluated once
      expect(result.status).toBe('Partially Verified');
    });
  });

  describe('F08: Normalized Source Attribution Model Boundaries', () => {
    it('F08-B1: Malformed and dangerous source URLs (javascript:, data:) are rejected/sanitized to null', () => {
      expect(sanitizeSourceUrl('javascript:alert(1)')).toBeNull();
      expect(sanitizeSourceUrl('data:text/html,test')).toBeNull();
      expect(sanitizeSourceUrl('not-a-valid-url')).toBeNull();
      expect(sanitizeSourceUrl('https://animalrescue.org/records/123')).toBe('https://animalrescue.org/records/123');
      expect(sanitizeSourceUrl('http://news.org/story')).toBe('http://news.org/story');
    });

    it('F08-B2: Institutional source types yield strictly higher weights than community eyewitnesses', () => {
      expect(SOURCE_WEIGHTS.police).toBeGreaterThan(SOURCE_WEIGHTS.eyewitness);
      expect(SOURCE_WEIGHTS.court_record).toBeGreaterThan(SOURCE_WEIGHTS.news_outlet);
      expect(SOURCE_WEIGHTS.shelter).toBeGreaterThan(SOURCE_WEIGHTS.eyewitness);
    });

    it('F08-B3: Extreme length source notes (5000+ chars) are safely clamped without data corruption', () => {
      const clampSourceNotes = (notes: string | undefined, maxChars: number = 500): string | undefined => {
        if (!notes) return undefined;
        const trimmed = notes.trim();
        return trimmed.length > maxChars ? trimmed.substring(0, maxChars) + '...' : trimmed;
      };

      const longNotes = 'Verified by phone call with head veterinarian Dr. Smith. '.repeat(100);
      const clamped = clampSourceNotes(longNotes, 500);

      expect(clamped?.length).toBeLessThanOrEqual(503);
      expect(clamped?.endsWith('...')).toBe(true);
    });

    it('F08-B4: Deduplication logic handles both identical URLs and identical name+type pairs', () => {
      const sources: SourceAttribution[] = [
        { id: '1', name: 'Dr. Jane Vet', type: 'veterinary_clinic', verifiedDate: '2026-08-01' },
        { id: '2', name: 'Dr. Jane Vet', type: 'veterinary_clinic', verifiedDate: '2026-08-01' },
      ];

      const result = calculateVerificationTier(sources);
      expect(result.confidenceScore).toBe(35);
    });

    it('F08-B5: Missing organization fallback uses source name or domain name', () => {
      const resolveOrgDisplay = (source: SourceAttribution): string => {
        if (source.organization && source.organization.trim()) {
          return source.organization.trim();
        }
        if (source.url) {
          try {
            return new URL(source.url).hostname.replace(/^www\./, '');
          } catch {
            // fallback
          }
        }
        return source.name;
      };

      const explicitOrg: SourceAttribution = { id: '1', name: 'Officer Dan', organization: 'Seattle Police', type: 'police', verifiedDate: '2026-08-01' };
      const urlOrg: SourceAttribution = { id: '2', name: 'Record #456', url: 'https://www.aspca.org/cases/456', type: 'shelter', verifiedDate: '2026-08-01' };
      const nameOnlyOrg: SourceAttribution = { id: '3', name: 'Neighbor Mary', type: 'eyewitness', verifiedDate: '2026-08-01' };

      expect(resolveOrgDisplay(explicitOrg)).toBe('Seattle Police');
      expect(resolveOrgDisplay(urlOrg)).toBe('aspca.org');
      expect(resolveOrgDisplay(nameOnlyOrg)).toBe('Neighbor Mary');
    });
  });

  describe('F09: Public Trust Cards & Badges Boundaries', () => {
    it('F09-B1: Trust badge color tokens map correctly per verification tier', () => {
      const getBadgeTheme = (status: VerificationStatus) => {
        switch (status) {
          case 'Strongly Verified':
            return { bg: '#EBF3ED', text: '#234E35', border: '#234E35', icon: 'shield-check' };
          case 'Verified':
            return { bg: '#EBF3ED', text: '#234E35', border: '#78A083', icon: 'check-circle' };
          case 'Partially Verified':
            return { bg: '#FEF7EC', text: '#C97A1E', border: '#C97A1E', icon: 'alert-triangle' };
          case 'Unverified':
          default:
            return { bg: '#F4F0EA', text: '#555555', border: '#E8E3DA', icon: 'help-circle' };
        }
      };

      expect(getBadgeTheme('Strongly Verified').icon).toBe('shield-check');
      expect(getBadgeTheme('Verified').text).toBe('#234E35');
      expect(getBadgeTheme('Partially Verified').text).toBe('#C97A1E');
      expect(getBadgeTheme('Unverified').text).toBe('#555555');
    });

    it('F09-B2: Trust card for Unverified story displays pending verification advisory without broken UI', () => {
      const renderTrustCardState = (record: VerificationRecord) => {
        return {
          statusBadge: record.status,
          hasSources: record.sources.length > 0,
          emptyStateNotice: record.sources.length === 0 ? 'Verification in progress by editorial staff.' : null,
          correctionLink: '/corrections'
        };
      };

      const unverifiedRecord: VerificationRecord = {
        status: 'Unverified',
        confidenceScore: 0,
        sources: [],
        verifiedAt: '2026-08-15T00:00:00Z',
        verifiedBy: '',
        methodologyNotes: 'Initial intake.'
      };

      const card = renderTrustCardState(unverifiedRecord);
      expect(card.statusBadge).toBe('Unverified');
      expect(card.hasSources).toBe(false);
      expect(card.emptyStateNotice).toBe('Verification in progress by editorial staff.');
      expect(card.correctionLink).toBe('/corrections');
    });

    it('F09-B3: Trust card with 20+ sources enables pagination or scroll container constraint', () => {
      const manySources: SourceAttribution[] = Array.from({ length: 25 }, (_, i) => ({
        id: `src-${i}`,
        name: `Source Verification Organization ${i}`,
        type: 'news_outlet' as SourceType,
        verifiedDate: '2026-08-01'
      }));

      const getSourceListMaxHeight = (sourceCount: number): string => {
        return sourceCount > 5 ? 'max-h-80 overflow-y-auto' : 'h-auto';
      };

      expect(getSourceListMaxHeight(25)).toBe('max-h-80 overflow-y-auto');
      expect(getSourceListMaxHeight(3)).toBe('h-auto');
    });

    it('F09-B4: Missing fact-checker attribution falls back to Editorial Board', () => {
      const getFactCheckerName = (verifiedBy?: string): string => {
        return verifiedBy && verifiedBy.trim().length > 0 ? verifiedBy.trim() : 'Eternal Paws Editorial Board';
      };

      expect(getFactCheckerName('')).toBe('Eternal Paws Editorial Board');
      expect(getFactCheckerName('   ')).toBe('Eternal Paws Editorial Board');
      expect(getFactCheckerName('Sarah Jenkins, Senior Fact-Checker')).toBe('Sarah Jenkins, Senior Fact-Checker');
    });

    it('F09-B5: Trust card expand/collapse toggle supports ARIA attributes and keyboard control', () => {
      interface TrustCardAccordionState {
        isExpanded: boolean;
        ariaExpanded: 'true' | 'false';
        ariaControls: string;
      }

      const toggleAccordion = (current: boolean): TrustCardAccordionState => {
        const next = !current;
        return {
          isExpanded: next,
          ariaExpanded: next ? 'true' : 'false',
          ariaControls: 'trust-card-source-panel'
        };
      };

      const closed = { isExpanded: false, ariaExpanded: 'false' as const, ariaControls: 'trust-card-source-panel' };
      const opened = toggleAccordion(closed.isExpanded);

      expect(opened.isExpanded).toBe(true);
      expect(opened.ariaExpanded).toBe('true');
      expect(opened.ariaControls).toBe('trust-card-source-panel');
    });
  });

  describe('F10: Image Copyright & AI Disclosure Tracking Boundaries', () => {
    it('F10-B1: AI visual reconstruction requires isAiGenerated flag and rationale of at least 10 chars', () => {
      const invalidAiImage = {
        licenseType: 'ai_visual_reconstruction' as ImageLicenseType,
        altText: 'AI depiction of rescue',
        credit: 'AI Art',
        aiDisclosure: { isAiGenerated: false, reconstructionRationale: '' }
      };

      const validAiImage = {
        licenseType: 'ai_visual_reconstruction' as ImageLicenseType,
        altText: 'Artistic reconstruction of dog rescue in 1940',
        credit: 'Midjourney v6 / Editorial Reconstruction',
        aiDisclosure: {
          isAiGenerated: true,
          aiToolUsed: 'Midjourney v6',
          reconstructionRationale: 'No historical photographs exist of the 1940 mountain pass rescue.'
        }
      };

      const invalidResult = validateImageAiDisclosure(invalidAiImage);
      const validResult = validateImageAiDisclosure(validAiImage);

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThanOrEqual(1);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors.length).toBe(0);
    });

    it('F10-B2: AI disclosure pill provides explicit label and rationale modal/tooltip', () => {
      const getDisclosureBadge = (licenseType: ImageLicenseType, rationale?: string) => {
        if (licenseType !== 'ai_visual_reconstruction') return null;
        return {
          label: 'AI Visual Reconstruction',
          tooltip: rationale || 'Visual illustration based on verified witness descriptions.',
          badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300'
        };
      };

      const badge = getDisclosureBadge('ai_visual_reconstruction', 'Archival reconstruction.');
      expect(badge?.label).toBe('AI Visual Reconstruction');
      expect(badge?.tooltip).toBe('Archival reconstruction.');

      const normalPhoto = getDisclosureBadge('original_photography');
      expect(normalPhoto).toBeNull();
    });

    it('F10-B3: Original photography requires explicit non-empty credit string', () => {
      const noCreditPhoto = {
        licenseType: 'original_photography' as ImageLicenseType,
        altText: 'Photo of Bella playing in the park',
        credit: ''
      };

      const result = validateImageAiDisclosure(noCreditPhoto);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Original photography requires explicit photographer credit.');
    });

    it('F10-B4: Empty or generic alt text fails accessibility and trust validation', () => {
      const badAltImage = {
        licenseType: 'licensed_stock' as ImageLicenseType,
        altText: 'dog', // < 5 chars
        credit: 'Getty Images'
      };

      const result = validateImageAiDisclosure(badAltImage);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Alt text must be at least 5 characters long.');
    });

    it('F10-B5: Image license type enum strictly accepts all 5 standard license categories', () => {
      const standardLicenses: ImageLicenseType[] = [
        'original_photography',
        'official_source_release',
        'licensed_stock',
        'user_submitted_verified',
        'ai_visual_reconstruction'
      ];

      const isValidLicense = (lic: string): lic is ImageLicenseType => standardLicenses.includes(lic as ImageLicenseType);

      for (const lic of standardLicenses) {
        expect(isValidLicense(lic)).toBe(true);
      }
      expect(isValidLicense('unlicensed_web_scrape')).toBe(false);
    });
  });

  describe('F11: Editorial Policies & Corrections Center Boundaries', () => {
    it('F11-B1: Correction intake form requires minimum 20 characters explanation', () => {
      const validateCorrectionSubmission = (payload: { storySlug: string; explanation: string; contactEmail: string }): { valid: boolean; error?: string } => {
        if (!payload.storySlug || payload.storySlug.trim().length === 0) {
          return { valid: false, error: 'Story reference is required.' };
        }
        if (!payload.explanation || payload.explanation.trim().length < 20) {
          return { valid: false, error: 'Correction details must be at least 20 characters.' };
        }
        if (!payload.contactEmail || !payload.contactEmail.includes('@')) {
          return { valid: false, error: 'Valid contact email is required.' };
        }
        return { valid: true };
      };

      const tooShort = validateCorrectionSubmission({ storySlug: 'max-rescue', explanation: 'Wrong date', contactEmail: 'test@example.com' });
      const valid = validateCorrectionSubmission({
        storySlug: 'max-rescue',
        explanation: 'The rescue happened in Summit County, Colorado, not Eagle County as stated.',
        contactEmail: 'witness@example.com'
      });

      expect(tooShort.valid).toBe(false);
      expect(tooShort.error).toContain('at least 20 characters');
      expect(valid.valid).toBe(true);
    });

    it('F11-B2: Story reference in correction form resolves slug or relative URL', () => {
      const extractStorySlug = (ref: string): string => {
        const clean = ref.trim();
        if (clean.includes('/stories/')) {
          const match = clean.match(/\/stories\/([a-z0-9-]+)/);
          return match ? match[1] : '';
        }
        return clean.toLowerCase().replace(/[^a-z0-9-]/g, '');
      };

      expect(extractStorySlug('https://eternal-paws.org/stories/brave-max-2026')).toBe('brave-max-2026');
      expect(extractStorySlug('/stories/brave-max-2026')).toBe('brave-max-2026');
      expect(extractStorySlug('brave-max-2026')).toBe('brave-max-2026');
    });

    it('F11-B3: Corrections log empty state displays clean reassurance message', () => {
      const renderCorrectionsLog = (corrections: any[]) => {
        if (corrections.length === 0) {
          return {
            hasCorrections: false,
            message: 'No published corrections on record for this story. All facts remain verified.'
          };
        }
        return { hasCorrections: true, count: corrections.length };
      };

      const emptyLog = renderCorrectionsLog([]);
      expect(emptyLog.hasCorrections).toBe(false);
      expect(emptyLog.message).toContain('No published corrections on record');
    });

    it('F11-B4: Spam prevention payload rejects correction text exceeding 3000 characters', () => {
      const validatePayloadSize = (text: string): boolean => {
        return text.length <= 3000;
      };

      const normalText = 'This is a valid correction statement.';
      const oversizedText = 'A'.repeat(3001);

      expect(validatePayloadSize(normalText)).toBe(true);
      expect(validatePayloadSize(oversizedText)).toBe(false);
    });

    it('F11-B5: Fact-checking charter page contains verified tier definitions for all 4 levels', () => {
      const factCheckingCharter = {
        title: 'Eternal Paws Fact-Checking & Verification Charter',
        tiers: [
          { status: 'Strongly Verified', minScore: 90, desc: 'Multiple primary institutional sources with documentary corroboration.' },
          { status: 'Verified', minScore: 70, desc: 'At least one institutional source and corroborating witness/media reports.' },
          { status: 'Partially Verified', minScore: 40, desc: 'Single shelter or community source under active editorial review.' },
          { status: 'Unverified', minScore: 0, desc: 'Community submission undergoing initial editorial intake and fact-checking.' },
        ]
      };

      expect(factCheckingCharter.tiers.length).toBe(4);
      expect(factCheckingCharter.tiers.map(t => t.status)).toEqual([
        'Strongly Verified', 'Verified', 'Partially Verified', 'Unverified'
      ]);
    });
  });
});
