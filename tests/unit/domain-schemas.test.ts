/**
 * Unit Test Suite: Domain Schemas, Validators & Error Formatters
 * Path: tests/unit/domain-schemas.test.ts
 * 
 * Requirements: ORIGINAL_REQUEST § R3, PROJECT.md F06
 */

import { describe, it, expect } from 'vitest';
import {
  storySchema,
  slugSchema,
  isoDateSchema,
  safeUrlSchema,
  storyCategorySchema,
  emotionalThemeSchema,
  emotionalThemesArraySchema,
  verificationStatusSchema,
  sourceTypeSchema,
  imageLicenseTypeSchema,
  locationInfoSchema,
  dogDetailsSchema,
  aiDisclosureSchema,
  imageMediaSchema,
  sourceAttributionSchema,
  verificationRecordSchema,
  submissionPayloadSchema,
  newsletterPayloadSchema,
  correctionSubmissionSchema,
  formatZodError,
  validateStory,
  parseStory,
  validateSubmission,
  validateNewsletter,
  validateCorrection
} from '@/domain/schemas';
import { allSeedStories, storyBellaRescue, storyLunaMiracle } from '@/lib/data/stories';

describe('Domain Schemas & Validation Engine (Unit Tests)', () => {
  describe('1. Master Seed Stories Schema Compliance', () => {
    it('validates every seed story against storySchema with 100% success', () => {
      expect(allSeedStories.length).toBeGreaterThanOrEqual(8);
      for (const story of allSeedStories) {
        const result = validateStory(story);
        if (!result.success) {
          console.error(`Validation failed for story ${story.slug}:`, result.errors);
        }
        expect(result.success).toBe(true);
      }
    });

    it('parseStory parses valid story without throwing', () => {
      const parsed = parseStory(storyBellaRescue);
      expect(parsed.id).toBe(storyBellaRescue.id);
      expect(parsed.dogName).toBe('Bella');
    });

    it('parseStory throws ZodError on invalid payload', () => {
      expect(() => parseStory({ invalid: true })).toThrow();
    });
  });

  describe('2. Slug Validator Schema', () => {
    it('accepts valid kebab-case lowercase alphanumeric slugs', () => {
      expect(slugSchema.safeParse('bella-blind-beagle').success).toBe(true);
      expect(slugSchema.safeParse('max-avalanche-dog-2024').success).toBe(true);
      expect(slugSchema.safeParse('hero-dog').success).toBe(true);
    });

    it('rejects invalid slugs with uppercase, spaces, double hyphens, or special characters', () => {
      expect(slugSchema.safeParse('Bella-Dog').success).toBe(false);
      expect(slugSchema.safeParse('bella dog').success).toBe(false);
      expect(slugSchema.safeParse('bella--dog').success).toBe(false);
      expect(slugSchema.safeParse('-bella-dog').success).toBe(false);
      expect(slugSchema.safeParse('bella-dog-').success).toBe(false);
      expect(slugSchema.safeParse('bella_dog').success).toBe(false);
      expect(slugSchema.safeParse('ab').success).toBe(false); // < 3 chars
    });
  });

  describe('3. ISO 8601 Date Validator', () => {
    it('accepts valid ISO 8601 date strings', () => {
      expect(isoDateSchema.safeParse('2025-01-20T08:00:00Z').success).toBe(true);
      expect(isoDateSchema.safeParse('2025-01-20').success).toBe(true);
      expect(isoDateSchema.safeParse('2025-01-20T08:00:00.000Z').success).toBe(true);
    });

    it('rejects malformed or non-calendar dates', () => {
      expect(isoDateSchema.safeParse('yesterday').success).toBe(false);
      expect(isoDateSchema.safeParse('2025-99-99').success).toBe(false);
      expect(isoDateSchema.safeParse('not-a-date').success).toBe(false);
    });
  });

  describe('4. Safe URL Schema & Protocol Defense', () => {
    it('accepts valid HTTP and HTTPS URLs', () => {
      expect(safeUrlSchema.safeParse('https://montanahumane.org/cases/1').success).toBe(true);
      expect(safeUrlSchema.safeParse('http://example.com/record').success).toBe(true);
    });

    it('rejects dangerous protocols (javascript:, data:, vbscript:, file:)', () => {
      expect(safeUrlSchema.safeParse('javascript:alert(1)').success).toBe(false);
      expect(safeUrlSchema.safeParse('data:text/html,<script>alert(1)</script>').success).toBe(false);
      expect(safeUrlSchema.safeParse('vbscript:msgbox(1)').success).toBe(false);
      expect(safeUrlSchema.safeParse('file:///etc/passwd').success).toBe(false);
    });
  });

  describe('5. Taxonomy & Categorical Enum Schemas', () => {
    it('validates all 6 allowed story categories', () => {
      const allowedCategories = ['reunions', 'hero-dogs', 'rescues', 'survival', 'loyalty', 'lost-and-found'];
      for (const cat of allowedCategories) {
        expect(storyCategorySchema.safeParse(cat).success).toBe(true);
      }
      expect(storyCategorySchema.safeParse('funny-dogs').success).toBe(false);
    });

    it('validates emotional themes array constraints (min 1, max 3)', () => {
      expect(emotionalThemesArraySchema.safeParse(['joyful']).success).toBe(true);
      expect(emotionalThemesArraySchema.safeParse(['joyful', 'inspiring', 'brave']).success).toBe(true);
      expect(emotionalThemesArraySchema.safeParse([]).success).toBe(false);
      expect(emotionalThemesArraySchema.safeParse(['joyful', 'inspiring', 'brave', 'miraculous']).success).toBe(false);
    });

    it('validates verification statuses and source types', () => {
      expect(verificationStatusSchema.safeParse('Strongly Verified').success).toBe(true);
      expect(verificationStatusSchema.safeParse('Verified').success).toBe(true);
      expect(verificationStatusSchema.safeParse('Partially Verified').success).toBe(true);
      expect(verificationStatusSchema.safeParse('Unverified').success).toBe(true);
      expect(verificationStatusSchema.safeParse('FakeStatus').success).toBe(false);

      expect(sourceTypeSchema.safeParse('shelter').success).toBe(true);
      expect(sourceTypeSchema.safeParse('police').success).toBe(true);
      expect(sourceTypeSchema.safeParse('random_blog').success).toBe(false);
    });
  });

  describe('6. Media & AI Visual Disclosure Constraints', () => {
    it('validates official source photography without AI disclosure', () => {
      const validPhoto = {
        url: 'https://images.eternal-paws.org/photo.webp',
        altText: 'A beautiful golden retriever resting in grass',
        credit: 'Jane Doe Photography',
        licenseType: 'official_source_release',
        width: 1200,
        height: 800,
        aspectRatio: '3:2'
      };
      expect(imageMediaSchema.safeParse(validPhoto).success).toBe(true);
    });

    it('requires isAiGenerated: true and rationale >= 10 chars for AI visual reconstruction', () => {
      const validAiMedia = {
        url: 'https://images.eternal-paws.org/ai-reconstruct.webp',
        altText: 'AI reconstruction of avalanche rescue dog at work',
        credit: 'Midjourney v6 Editorial Reconstruction',
        licenseType: 'ai_visual_reconstruction',
        width: 1200,
        height: 675,
        aspectRatio: '16:9',
        aiDisclosure: {
          isAiGenerated: true,
          aiToolUsed: 'Midjourney v6',
          reconstructionRationale: 'Archival visual scene reconstructed from verified dispatch notes.'
        }
      };
      expect(imageMediaSchema.safeParse(validAiMedia).success).toBe(true);

      const invalidAiMissingObj = {
        ...validAiMedia,
        aiDisclosure: undefined
      };
      expect(imageMediaSchema.safeParse(invalidAiMissingObj).success).toBe(false);

      const invalidAiShortRationale = {
        ...validAiMedia,
        aiDisclosure: {
          isAiGenerated: true,
          reconstructionRationale: 'Too short' // < 10 chars
        }
      };
      expect(imageMediaSchema.safeParse(invalidAiShortRationale).success).toBe(false);
    });

    it('enforces minimum 5 characters on alt text for accessibility', () => {
      const shortAlt = {
        url: 'https://images.eternal-paws.org/photo.webp',
        altText: 'dog', // < 5 chars
        credit: 'Jane Doe',
        licenseType: 'licensed_stock',
        width: 800,
        height: 600,
        aspectRatio: '4:3'
      };
      expect(imageMediaSchema.safeParse(shortAlt).success).toBe(false);
    });
  });

  describe('7. Transactional Payloads Validation', () => {
    it('validates contributor story submission payload', () => {
      const validSubmission = {
        contributorName: 'Alice Walker',
        contributorEmail: 'alice@example.com',
        dogName: 'Cooper',
        dogBreed: 'Border Collie',
        location: { city: 'Seattle', stateOrProvince: 'Washington', country: 'United States' },
        category: 'rescues',
        emotionalThemes: ['inspiring', 'brave'],
        title: 'Cooper\'s Mountain Trail Rescue',
        narrative: 'Cooper was found on the remote summit trail after an arduous two-week search through storm winds and rain.',
        imageRightsAgreed: true,
        sources: [
          { name: 'King County SAR', type: 'police' }
        ]
      };

      const result = validateSubmission(validSubmission);
      expect(result.success).toBe(true);
    });

    it('rejects contributor submission with missing rights agreement or invalid email', () => {
      const invalidSubmission = {
        contributorName: 'Alice',
        contributorEmail: 'not-an-email',
        dogName: 'Cooper',
        dogBreed: 'Collie',
        location: { city: 'Seattle', stateOrProvince: 'WA', country: 'USA' },
        category: 'rescues',
        emotionalThemes: ['inspiring'],
        title: 'Rescue Story',
        narrative: 'Short narrative that still meets the minimum length requirement for submission testing.',
        imageRightsAgreed: false, // Invalid
        sources: []
      };

      const result = validateSubmission(invalidSubmission);
      expect(result.success).toBe(false);
    });

    it('validates newsletter signup payload', () => {
      expect(validateNewsletter({ email: 'pack@example.com', consentAgreed: true }).success).toBe(true);
      expect(validateNewsletter({ email: 'invalid', consentAgreed: true }).success).toBe(false);
      expect(validateNewsletter({ email: 'pack@example.com', consentAgreed: false }).success).toBe(false);
    });

    it('validates correction submission payload', () => {
      const validCorr = {
        storyId: 'story-bella-001',
        storySlug: 'bella-blind-beagle-sanctuary-journey',
        claimDescription: 'Rescue date was stated as November 14th instead of 12th.',
        correctionDetails: 'Official shelter logs confirm intake took place on November 12th at 9:00 AM.',
        submitterEmail: 'factchecker@example.com'
      };
      expect(validateCorrection(validCorr).success).toBe(true);

      const tooShortDetails = {
        ...validCorr,
        correctionDetails: 'Wrong date.' // < 20 chars
      };
      expect(validateCorrection(tooShortDetails).success).toBe(false);
    });
  });

  describe('8. formatZodError Helper', () => {
    it('structures Zod issues into field-indexed error record', () => {
      const result = storySchema.safeParse({ title: 'tiny' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const formatted = formatZodError(result.error);
        expect(typeof formatted).toBe('object');
        expect(Object.keys(formatted).length).toBeGreaterThan(0);
      }
    });
  });
});
