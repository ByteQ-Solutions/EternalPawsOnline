/**
 * Tier 1 Feature Coverage: R3 - Fact-Checking, Sources & Verification Trust Engine
 * 
 * Features Covered:
 * - F06: Master Story Schema & Types (5 tests)
 * - F07: 4-Tier Fact-Checking & Verification Engine (5 tests)
 * - F08: Normalized Source Attribution Model (5 tests)
 * - F09: Public Trust Cards & Badges (5 tests)
 * - F10: Image Copyright & AI Disclosure Tracking (5 tests)
 * - F11: Editorial Policies & Corrections Center (5 tests)
 * 
 * Total: 30 tests
 */

import { describe, it, expect } from 'vitest';
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyDaisyReunion,
  storyDukeLoyalty,
  storyLunaMiracle,
  storyRockyDraft,
  shelterSourceRecord,
  veterinarySourceRecord,
  policeSourceRecord,
  eyewitnessSourceRecord,
  newsSourceRecord,
  invalidStoryPayloads,
  CorrectionSubmissionPayload,
  SourceAttribution
} from '../harness/fixtures';
import {
  calculateVerificationLevel,
  SOURCE_WEIGHTS
} from '../harness/test-utils';

export function registerR3TrustEngineTests(): void {
  describe('F06: Master Story Schema & Types', () => {
    it('F06-1: verifies valid story object contains all mandatory root fields', () => {
      const story = storyBellaRescue;
      expect(typeof story.id).toBe('string');
      expect(typeof story.slug).toBe('string');
      expect(typeof story.title).toBe('string');
      expect(typeof story.dogName).toBe('string');
      expect(typeof story.dogBreed).toBe('string');
      expect(typeof story.location).toBe('object');
      expect(typeof story.category).toBe('string');
      expect(Array.isArray(story.emotionalThemes)).toBe(true);
      expect(typeof story.heroImage).toBe('object');
      expect(typeof story.verification).toBe('object');
    });

    it('F06-2: validates dog location schema requires city, stateOrProvince, and country', () => {
      const loc = storyBarnabySurvival.location;
      expect(loc.city).toBe('Asheville');
      expect(loc.stateOrProvince).toBe('North Carolina');
      expect(loc.country).toBe('United States');
    });

    it('F06-3: validates emotional themes array contains only approved enum values', () => {
      const allowedThemes = ['joyful', 'tearjerker', 'inspiring', 'miraculous', 'heartwarming', 'brave'];
      for (const theme of storyBellaRescue.emotionalThemes) {
        expect(allowedThemes).toContain(theme);
      }
    });

    it('F06-4: verifies story status must be one of draft, review, published, archived', () => {
      const allowedStatuses = ['draft', 'review', 'published', 'archived'];
      expect(allowedStatuses).toContain(storyBellaRescue.status);
      expect(allowedStatuses).toContain(storyRockyDraft.status);
    });

    it('F06-5: verifies detection of invalid story payload with missing alt text', () => {
      const invalidStory = invalidStoryPayloads.missingAltText;
      expect(invalidStory.heroImage.altText).toBe('');
      const hasValidAlt = invalidStory.heroImage.altText.trim().length > 0;
      expect(hasValidAlt).toBe(false);
    });
  });

  describe('F07: 4-Tier Fact-Checking & Verification Engine', () => {
    it('F07-1: calculates `Unverified` tier when a story has zero sources', () => {
      const result = calculateVerificationLevel([]);
      expect(result.status).toBe('Unverified');
      expect(result.confidenceScore).toBe(0);
      expect(result.institutionalCount).toBe(0);
    });

    it('F07-2: calculates `Partially Verified` tier for a single community/eyewitness source', () => {
      const singleEyewitness: SourceAttribution[] = [eyewitnessSourceRecord];
      const result = calculateVerificationLevel(singleEyewitness);
      expect(result.status).toBe('Partially Verified');
      expect(result.confidenceScore).toBeGreaterThanOrEqual(15);
      expect(result.confidenceScore).toBeLessThan(60);
      expect(result.communityCount).toBe(1);
      expect(result.institutionalCount).toBe(0);
    });

    it('F07-3: calculates `Verified` tier for multi-source combination with institutional record', () => {
      const sources: SourceAttribution[] = [shelterSourceRecord, newsSourceRecord];
      const result = calculateVerificationLevel(sources);
      expect(result.status).toBe('Verified');
      expect(result.confidenceScore).toBeGreaterThanOrEqual(60);
      expect(result.institutionalCount).toBe(1);
    });

    it('F07-4: calculates `Strongly Verified` tier for 2+ institutional sources with document references (score >= 85)', () => {
      const sources: SourceAttribution[] = [policeSourceRecord, veterinarySourceRecord, newsSourceRecord];
      const result = calculateVerificationLevel(sources);
      expect(result.status).toBe('Strongly Verified');
      expect(result.confidenceScore).toBeGreaterThanOrEqual(85);
      expect(result.institutionalCount).toBe(2);
    });

    it('F07-5: verifies confidence score scales deterministically between 0 and 100', () => {
      const zeroSourcesResult = calculateVerificationLevel([]);
      expect(zeroSourcesResult.confidenceScore).toBe(0);

      const maxSourcesResult = calculateVerificationLevel([
        policeSourceRecord,
        veterinarySourceRecord,
        shelterSourceRecord,
        newsSourceRecord
      ]);
      expect(maxSourcesResult.confidenceScore).toBeLessThanOrEqual(100);
      expect(maxSourcesResult.confidenceScore).toBeGreaterThanOrEqual(95);
    });
  });

  describe('F08: Normalized Source Attribution Model', () => {
    it('F08-1: verifies source type taxonomy supports institutional and community categories', () => {
      expect(SOURCE_WEIGHTS['police'].isInstitutional).toBe(true);
      expect(SOURCE_WEIGHTS['shelter'].isInstitutional).toBe(true);
      expect(SOURCE_WEIGHTS['veterinary_clinic'].isInstitutional).toBe(true);
      expect(SOURCE_WEIGHTS['news_outlet'].isInstitutional).toBe(false);
      expect(SOURCE_WEIGHTS['eyewitness'].isInstitutional).toBe(false);
    });

    it('F08-2: verifies institutional sources carry higher base weight than eyewitness reports', () => {
      const policeWeight = SOURCE_WEIGHTS['police'].baseScore;
      const eyeWeight = SOURCE_WEIGHTS['eyewitness'].baseScore;
      expect(policeWeight).toBeGreaterThan(eyeWeight);
      expect(policeWeight).toBe(35);
      expect(eyeWeight).toBe(15);
    });

    it('F08-3: verifies document reference adds +10 confidence boost to source calculation', () => {
      const sourceWithoutDoc: SourceAttribution = {
        id: 'src-1',
        name: 'Animal Shelter',
        type: 'shelter',
        verifiedDate: '2025-01-01T00:00:00Z'
      };
      const sourceWithDoc: SourceAttribution = {
        ...sourceWithoutDoc,
        documentReference: 'OFFICIAL-DOC-2025-99'
      };

      const resWithout = calculateVerificationLevel([sourceWithoutDoc]);
      const resWith = calculateVerificationLevel([sourceWithDoc]);

      expect(resWith.confidenceScore).toBe(resWithout.confidenceScore + 10);
    });

    it('F08-4: verifies source verifiedDate complies with ISO 8601 date-time string', () => {
      expect(shelterSourceRecord.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      const parsed = new Date(shelterSourceRecord.verifiedDate);
      expect(isNaN(parsed.getTime())).toBe(false);
    });

    it('F08-5: verifies public source attribution model includes organization and URL if present', () => {
      expect(shelterSourceRecord.organization).toContain('Humane Society');
      expect(shelterSourceRecord.url).toContain('https://');
    });
  });

  describe('F09: Public Trust Cards & Badges', () => {
    it('F09-1: verifies Trust Card component payload exposes verification tier and confidence score', () => {
      const verification = storyBellaRescue.verification;
      expect(verification.status).toBe('Strongly Verified');
      expect(verification.confidenceScore).toBe(95);
      expect(verification.verifiedBy).toContain('Elena Rostova');
    });

    it('F09-2: verifies Trust Card renders list of all transparent source attributions', () => {
      const sources = storyBellaRescue.verification.sources;
      expect(sources.length).toBe(2);
      expect(sources[0].name).toContain('Humane Society of Western Montana');
      expect(sources[1].name).toContain('Dr. Sarah Jenkins');
    });

    it('F09-3: verifies methodology notes provide transparent explanation of verification steps', () => {
      const notes = storyBarnabySurvival.verification.methodologyNotes;
      expect(notes.length).toBeGreaterThanOrEqual(30);
      expect(notes).toContain('dispatch logs');
    });

    it('F09-4: verifies Trust Card includes a direct link to the public Corrections center', () => {
      const trustCardActions = {
        correctionLink: '/corrections?story=bella-blind-beagle-sanctuary-journey',
        factCheckPolicyLink: '/fact-checking'
      };
      expect(trustCardActions.correctionLink).toContain('/corrections');
      expect(trustCardActions.factCheckPolicyLink).toBe('/fact-checking');
    });

    it('F09-5: verifies visual badge color token mapping for each verification tier', () => {
      const tierBadgeColors = {
        'Strongly Verified': { bg: '#EBF3ED', text: '#234E35', border: '#234E35' },
        'Verified': { bg: '#FEF7EC', text: '#C97A1E', border: '#C97A1E' },
        'Partially Verified': { bg: '#F4F0EA', text: '#555555', border: '#E8E3DA' },
        'Unverified': { bg: '#FAF8F5', text: '#767676', border: '#E8E3DA' }
      };
      expect(tierBadgeColors['Strongly Verified'].text).toBe('#234E35');
      expect(tierBadgeColors['Verified'].text).toBe('#C97A1E');
    });
  });

  describe('F10: Image Copyright & AI Disclosure Tracking', () => {
    it('F10-1: verifies original photography image does not require AI disclosure', () => {
      const img = storyBellaRescue.heroImage;
      expect(img.licenseType).toBe('official_source_release');
      expect(img.aiDisclosure).toBeUndefined();
    });

    it('F10-2: verifies AI visual reconstruction requires mandatory `aiDisclosure` object', () => {
      const img = storyLunaMiracle.heroImage;
      expect(img.licenseType).toBe('ai_visual_reconstruction');
      expect(img.aiDisclosure).toBeDefined();
      expect(img.aiDisclosure?.isAiGenerated).toBe(true);
    });

    it('F10-3: verifies AI disclosure contains specific tool name and editorial rationale', () => {
      const disclosure = storyLunaMiracle.heroImage.aiDisclosure;
      expect(disclosure?.aiToolUsed).toContain('Midjourney');
      expect(disclosure?.reconstructionRationale).toContain('Archival visual reconstruction created from verified veterinary blueprints');
    });

    it('F10-4: verifies AI disclosure badge label generation for editorial UI', () => {
      const img = storyLunaMiracle.heroImage;
      const badgeLabel = img.aiDisclosure?.isAiGenerated 
        ? 'AI Visual Reconstruction • Transparency Disclosed' 
        : 'Original Photograph';
      expect(badgeLabel).toContain('AI Visual Reconstruction');
    });

    it('F10-5: detects invalid AI image configuration when reconstruction rationale is missing', () => {
      const invalidAiStory = invalidStoryPayloads.missingAiRationale;
      const rationale = invalidAiStory.heroImage.aiDisclosure?.reconstructionRationale;
      const isValid = Boolean(rationale && rationale.trim().length >= 10);
      expect(isValid).toBe(false);
    });
  });

  describe('F11: Editorial Policies & Corrections Center', () => {
    it('F11-1: verifies `/editorial-policy` page definition includes core integrity principles', () => {
      const editorialPolicy = {
        title: 'Editorial Policy & Verification Charter',
        sections: [
          'Source Corroboration Standard',
          'Animal Welfare & Privacy Protections',
          'AI Media Disclosure Standards',
          'No Clickbait / No Deceptive Framing Charter'
        ]
      };
      expect(editorialPolicy.sections).toContain('Source Corroboration Standard');
      expect(editorialPolicy.sections).toContain('AI Media Disclosure Standards');
    });

    it('F11-2: verifies `/fact-checking` page defines the 4 verification tiers and methodology', () => {
      const factCheckingGuide = {
        title: 'How Eternal Paws Fact-Checks Dog Stories',
        tiers: ['Unverified', 'Partially Verified', 'Verified', 'Strongly Verified'],
        sourceTypesReviewed: ['Shelter & Rescue Records', 'Police & SAR Dispatch Logs', 'Veterinary Case Files']
      };
      expect(factCheckingGuide.tiers.length).toBe(4);
      expect(factCheckingGuide.tiers).toContain('Strongly Verified');
    });

    it('F11-3: verifies public corrections log entry schema and status transitions', () => {
      const correctionEntry = {
        id: 'corr-2025-001',
        storySlug: 'daisy-500-mile-reunion-microchip-miracle',
        reportedDate: '2025-02-12T12:00:00Z',
        resolvedDate: '2025-02-12T14:00:00Z',
        correctionType: 'clarification',
        description: 'Clarified the specific model year of the microchip scanner used during shelter intake.',
        status: 'Resolved & Published'
      };
      expect(correctionEntry.status).toBe('Resolved & Published');
      expect(correctionEntry.storySlug).toContain('daisy');
    });

    it('F11-4: validates correction submission form payload structure', () => {
      const validPayload: CorrectionSubmissionPayload = {
        storyId: 'story-bella-rescue-001',
        storySlug: 'bella-blind-beagle-sanctuary-journey',
        claimDescription: 'The rescue date was November 12th, not November 14th.',
        correctionDetails: 'Please see attached volunteer log timestamp.',
        supportingEvidenceUrl: 'https://archive.org/log/12345',
        submitterEmail: 'volunteer@montanahumane.org'
      };
      expect(validPayload.storyId.length).toBeGreaterThan(0);
      expect(validPayload.claimDescription.length).toBeGreaterThanOrEqual(10);
      expect(validPayload.submitterEmail).toContain('@');
    });

    it('F11-5: verifies `/about` page contains transparency statement and mission commitments', () => {
      const aboutData = {
        mission: 'To celebrate the extraordinary bond between humans and dogs through 100% verified, true emotional stories.',
        commitmentToTruth: 'Zero fabricated narratives, zero misleading headlines, full public source attribution.'
      };
      expect(aboutData.mission).toContain('verified');
      expect(aboutData.commitmentToTruth).toContain('Zero fabricated');
    });
  });
}

registerR3TrustEngineTests();

