/**
 * Unit Test Suite: Verification Calculus Engine & Seed Data Integrity
 * Path: tests/unit/verification-calculus.test.ts
 * 
 * Requirements: ORIGINAL_REQUEST § R3, PROJECT.md F07, F08
 */

import { describe, it, expect } from 'vitest';
import {
  calculateVerificationLevel,
  calculateVerificationTier,
  calculateVerificationRecord,
  calculateVerificationScore,
  sanitizeSourceUrl,
  isInstitutionalSource,
  getSourceWeight,
  deduplicateSources,
  validateSources,
  generateMethodologySummary,
  SOURCE_WEIGHTS
} from '@/domain/verification';
import {
  allSeedStories,
  publishedSeedStories,
  getStoryBySlug,
  getStoriesByCategory,
  getFeaturedStories,
  getRelatedStoriesSeed,
  storyBellaRescue,
  sourceMontanaHumane,
  sourceCascadeVet,
  sourcePitkinPoliceSAR,
  sourceEyewitnessArthur
} from '@/lib/data/stories';
import { SourceAttribution } from '@/domain/types';

describe('Verification Calculus Engine (Unit & Boundary Tests)', () => {
  describe('1. Baseline Source Weights & Taxonomy', () => {
    it('accurately resolves base scores for all 7 source types', () => {
      expect(getSourceWeight('police').baseScore).toBe(40);
      expect(getSourceWeight('court_record').baseScore).toBe(40);
      expect(getSourceWeight('official_agency').baseScore).toBe(35);
      expect(getSourceWeight('veterinary_clinic').baseScore).toBe(35);
      expect(getSourceWeight('shelter').baseScore).toBe(30);
      expect(getSourceWeight('news_outlet').baseScore).toBe(25);
      expect(getSourceWeight('eyewitness').baseScore).toBe(15);
    });

    it('accurately identifies institutional vs community source categories', () => {
      expect(isInstitutionalSource('police')).toBe(true);
      expect(isInstitutionalSource('court_record')).toBe(true);
      expect(isInstitutionalSource('official_agency')).toBe(true);
      expect(isInstitutionalSource('veterinary_clinic')).toBe(true);
      expect(isInstitutionalSource('shelter')).toBe(true);
      expect(isInstitutionalSource('news_outlet')).toBe(false);
      expect(isInstitutionalSource('eyewitness')).toBe(false);
    });
  });

  describe('2. Additive Evidentiary Boosts', () => {
    it('applies +10 documentReference boost when document ID is present', () => {
      const base: SourceAttribution = {
        id: '1',
        name: 'Shelter',
        type: 'shelter',
        verifiedDate: '2025-01-01T00:00:00Z'
      };
      const withDoc: SourceAttribution = {
        ...base,
        documentReference: 'DOC-12345'
      };

      const resBase = calculateVerificationLevel([base]);
      const resWithDoc = calculateVerificationLevel([withDoc]);
      expect(resWithDoc.confidenceScore).toBe(resBase.confidenceScore + 10);
    });

    it('applies +5 URL boost when valid HTTP/HTTPS URL is present', () => {
      const base: SourceAttribution = {
        id: '1',
        name: 'Shelter',
        type: 'shelter',
        verifiedDate: '2025-01-01T00:00:00Z'
      };
      const withUrl: SourceAttribution = {
        ...base,
        url: 'https://example-shelter.org/record'
      };

      const resBase = calculateVerificationLevel([base]);
      const resWithUrl = calculateVerificationLevel([withUrl]);
      expect(resWithUrl.confidenceScore).toBe(resBase.confidenceScore + 5);
    });
  });

  describe('3. URL Protocol Sanitization & Defense', () => {
    it('sanitizes and strips dangerous or malicious URL schemes', () => {
      expect(sanitizeSourceUrl('javascript:alert(1)')).toBeNull();
      expect(sanitizeSourceUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
      expect(sanitizeSourceUrl('vbscript:msgbox(1)')).toBeNull();
      expect(sanitizeSourceUrl('file:///etc/passwd')).toBeNull();
      expect(sanitizeSourceUrl('invalid-plain-text')).toBeNull();
    });

    it('preserves valid HTTP and HTTPS URLs', () => {
      expect(sanitizeSourceUrl('https://montanahumane.org/cases/1')).toBe('https://montanahumane.org/cases/1');
      expect(sanitizeSourceUrl('http://news.org/article')).toBe('http://news.org/article');
    });
  });

  describe('4. Source Deduplication & Anti-Stuffing', () => {
    it('deduplicates sources with identical URLs', () => {
      const dupSources: SourceAttribution[] = [
        { id: '1', name: 'Police SAR', type: 'police', url: 'https://police.gov/log-1', verifiedDate: '2025-01-01T00:00:00Z' },
        { id: '2', name: 'Police SAR Copy', type: 'police', url: 'https://police.gov/log-1', verifiedDate: '2025-01-01T00:00:00Z' }
      ];

      const dedupled = deduplicateSources(dupSources);
      expect(dedupled.length).toBe(1);

      const result = calculateVerificationTier(dupSources);
      // Base 40 + URL 5 = 45 (scored once)
      expect(result.confidenceScore).toBe(45);
      expect(result.status).toBe('Partially Verified');
    });

    it('deduplicates sources with identical name and type when URL is absent', () => {
      const dupSources: SourceAttribution[] = [
        { id: '1', name: 'Dr. Jane Vet', type: 'veterinary_clinic', verifiedDate: '2025-01-01T00:00:00Z' },
        { id: '2', name: 'Dr. Jane Vet', type: 'veterinary_clinic', verifiedDate: '2025-01-01T00:00:00Z' }
      ];

      const dedupled = deduplicateSources(dupSources);
      expect(dedupled.length).toBe(1);
      expect(calculateVerificationTier(dupSources).confidenceScore).toBe(35);
    });
  });

  describe('5. 4-Tier Boundary Thresholds & Transitions', () => {
    it('zero sources strictly evaluates to Unverified with score 0', () => {
      const result = calculateVerificationLevel([]);
      expect(result.status).toBe('Unverified');
      expect(result.confidenceScore).toBe(0);
      expect(result.totalSources).toBe(0);
    });

    it('single eyewitness (15 pts) evaluates to Unverified (<40)', () => {
      const eyewitnessOnly: SourceAttribution[] = [
        { id: '1', name: 'Trail Hiker', type: 'eyewitness', verifiedDate: '2025-01-01T00:00:00Z' }
      ];
      const result = calculateVerificationTier(eyewitnessOnly);
      expect(result.confidenceScore).toBe(15);
      expect(result.status).toBe('Unverified');
    });

    it('shelter + eyewitness (30 + 15 = 45) evaluates to Partially Verified (40-69)', () => {
      const sources: SourceAttribution[] = [
        { id: '1', name: 'Shelter', type: 'shelter', verifiedDate: '2025-01-01T00:00:00Z' },
        { id: '2', name: 'Witness', type: 'eyewitness', verifiedDate: '2025-01-01T00:00:00Z' }
      ];
      const result = calculateVerificationTier(sources);
      expect(result.confidenceScore).toBe(45);
      expect(result.status).toBe('Partially Verified');
    });

    it('police + shelter (40 + 30 = 70) evaluates to Verified (70-89)', () => {
      const sources: SourceAttribution[] = [
        { id: '1', name: 'Police', type: 'police', verifiedDate: '2025-01-01T00:00:00Z' },
        { id: '2', name: 'Shelter', type: 'shelter', verifiedDate: '2025-01-01T00:00:00Z' }
      ];
      const result = calculateVerificationTier(sources);
      expect(result.confidenceScore).toBe(70);
      expect(result.status).toBe('Verified');
    });

    it('police (40+10+5) + vet (35+10+5) = 100 evaluates to Strongly Verified (90-100)', () => {
      const sources: SourceAttribution[] = [sourcePitkinPoliceSAR, sourceCascadeVet];
      const result = calculateVerificationLevel(sources);
      expect(result.confidenceScore).toBeGreaterThanOrEqual(90);
      expect(result.institutionalCount).toBe(2);
      expect(result.status).toBe('Strongly Verified');
    });

    it('caps maximum confidence score strictly at 100 for excessive sources', () => {
      const excessiveSources: SourceAttribution[] = [
        sourcePitkinPoliceSAR,
        sourceCascadeVet,
        sourceMontanaHumane,
        sourceEyewitnessArthur
      ];
      const result = calculateVerificationTier(excessiveSources);
      expect(result.confidenceScore).toBe(100);
      expect(result.status).toBe('Strongly Verified');
    });
  });

  describe('6. Auto-Downgrades & Guardrails', () => {
    it('enforces single eyewitness cap even if boosts push score up', () => {
      const boostedEyewitness: SourceAttribution[] = [
        {
          id: '1',
          name: 'Sworn Bystander',
          type: 'eyewitness',
          documentReference: 'SWORN-AFFIDAVIT-99',
          url: 'https://example.com/interview',
          verifiedDate: '2025-01-01T00:00:00Z'
        }
      ]; // 15 + 10 + 5 = 30 pts

      const result = calculateVerificationLevel(boostedEyewitness);
      expect(result.confidenceScore).toBe(30);
      expect(result.status).toBe('Partially Verified');
    });

    it('applies dispute penalty and records audit trace when dispute flag is set', () => {
      const sources = [sourceMontanaHumane];
      const clean = calculateVerificationLevel(sources);
      const disputed = calculateVerificationLevel(sources, { activeDisputeFlag: true });

      expect(disputed.confidenceScore).toBe(clean.confidenceScore - 25);
      expect(disputed.autoDowngradesApplied.some(d => d.includes('dispute'))).toBe(true);
    });
  });

  describe('7. Verification Record & Methodology Generators', () => {
    it('calculateVerificationRecord generates complete audit record', () => {
      const record = calculateVerificationRecord([sourceMontanaHumane], 'Custom notes', 'Auditor Alice');
      expect(record.status).toBe('Partially Verified');
      expect(record.verifiedBy).toBe('Auditor Alice');
      expect(record.methodologyNotes).toBe('Custom notes');
      expect(record.sources.length).toBe(1);
    });

    it('generateMethodologySummary creates transparent explanation', () => {
      const summary = generateMethodologySummary([sourceMontanaHumane, sourceCascadeVet], 95, 'Strongly Verified');
      expect(summary).toContain('2 independent source citation(s)');
      expect(summary).toContain('2 institutional record(s)');
      expect(summary).toContain('95/100');
    });

    it('validateSources returns validation issues for invalid source items', () => {
      const invalidSources: any[] = [
        { id: '1', name: '', type: 'shelter', verifiedDate: '2025-01-01T00:00:00Z' },
        { id: '2', name: 'Valid Name', type: 'unknown_type', verifiedDate: 'invalid-date' }
      ];
      const check = validateSources(invalidSources);
      expect(check.valid).toBe(false);
      expect(check.issues.length).toBeGreaterThan(0);
    });
  });

  describe('8. Seed Data Integrity & Editorial Completeness', () => {
    it('contains at least 8 rich seed stories covering all 6 categories', () => {
      expect(allSeedStories.length).toBeGreaterThanOrEqual(8);
      const categories = new Set(allSeedStories.map(s => s.category));
      expect(categories.has('reunions')).toBe(true);
      expect(categories.has('hero-dogs')).toBe(true);
      expect(categories.has('rescues')).toBe(true);
      expect(categories.has('survival')).toBe(true);
      expect(categories.has('loyalty')).toBe(true);
      expect(categories.has('lost-and-found')).toBe(true);
    });

    it('every story satisfies kebab-case slug regex and has non-empty title/content', () => {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      for (const story of allSeedStories) {
        expect(slugRegex.test(story.slug)).toBe(true);
        expect(story.title.length).toBeGreaterThanOrEqual(10);
        expect(story.content.length).toBeGreaterThanOrEqual(200);
        expect(story.location.city.length).toBeGreaterThan(0);
        expect(story.heroImage.altText.length).toBeGreaterThanOrEqual(10);
      }
    });

    it('AI visual reconstruction stories have mandatory complete AI disclosures', () => {
      const aiStories = allSeedStories.filter(s => s.heroImage.licenseType === 'ai_visual_reconstruction');
      expect(aiStories.length).toBeGreaterThan(0);
      for (const story of aiStories) {
        expect(story.heroImage.aiDisclosure?.isAiGenerated).toBe(true);
        expect(story.heroImage.aiDisclosure?.aiToolUsed?.length).toBeGreaterThan(0);
        expect(story.heroImage.aiDisclosure?.reconstructionRationale?.length).toBeGreaterThanOrEqual(20);
      }
    });

    it('query accessors retrieve correct filtered story subsets', () => {
      const rescues = getStoriesByCategory('rescues');
      expect(rescues.every(s => s.category === 'rescues')).toBe(true);

      const featured = getFeaturedStories();
      expect(featured.every(s => s.featured)).toBe(true);

      const bella = getStoryBySlug('bella-blind-beagle-sanctuary-journey');
      expect(bella).toBeDefined();
      expect(bella?.dogName).toBe('Bella');

      // Test redirect lookup
      const redirectedBuster = getStoryBySlug('buster-lost-in-lancaster');
      expect(redirectedBuster).toBeDefined();
      expect(redirectedBuster?.dogName).toBe('Buster');
    });

    it('getRelatedStoriesSeed retrieves prioritized related stories', () => {
      const related = getRelatedStoriesSeed(storyBellaRescue, 2);
      expect(related.length).toBeLessThanOrEqual(2);
      expect(related.some(s => s.id === storyBellaRescue.id)).toBe(false);
    });
  });
});
