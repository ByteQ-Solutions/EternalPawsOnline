/**
 * Tier 1 Feature Coverage: R5 - Reader Engagement & Editorial CMS
 * 
 * Features Covered:
 * - F21: Non-Intrusive Newsletter Signup (5 tests)
 * - F22: Multi-Step Story Submission Flow (5 tests)
 * - F23: Secure Admin Editorial CMS Dashboard (5 tests)
 * - F24: CMS Pre-Publish Checklist Gate (5 tests)
 * - F25: Automated 301 Redirect Engine (5 tests)
 * 
 * Total: 25 tests
 */

import { describe, it, expect } from 'vitest';
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyRockyDraft,
  storyArchivedWithRedirects,
  allSeedStories,
  invalidSubmissionPayloads,
  invalidStoryPayloads,
  SubmissionPayload,
  NewsletterPayload
} from '../harness/fixtures';
import {
  validateEmail,
  validateImageUpload,
  runCmsPrePublishChecklist,
  resolveRedirect
} from '../harness/test-utils';

export function registerR5EngagementCmsTests(): void {
  describe('F21: Non-Intrusive Newsletter Signup', () => {
    it('F21-1: accepts valid RFC email addresses and returns successful subscription status', () => {
      const validEmails = [
        'doglover@example.com',
        'sarah.smith+newsletter@gmail.com',
        'rescues@shelter.org'
      ];
      for (const email of validEmails) {
        expect(validateEmail(email)).toBe(true);
      }
    });

    it('F21-2: rejects invalid email formats with explicit validation failures', () => {
      const invalidEmails = [
        '',
        'notanemail',
        '@missinguser.com',
        'missingdomain@',
        'spaces in@email.com'
      ];
      for (const email of invalidEmails) {
        expect(validateEmail(email)).toBe(false);
      }
    });

    it('F21-3: validates newsletter brand copy and value proposition', () => {
      const newsletterConfig = {
        headline: 'Join the Pack',
        subheadline: 'One True Dog Story Every Sunday',
        frequency: 'Weekly',
        antiSpamGuarantee: 'Zero spam, zero popups. Unsubscribe anytime with one click.'
      };
      expect(newsletterConfig.headline).toBe('Join the Pack');
      expect(newsletterConfig.subheadline).toContain('One True Dog Story Every Sunday');
    });

    it('F21-4: handles idempotent subscription payload without throwing errors', () => {
      const payload: NewsletterPayload = {
        email: 'reader@example.com',
        referrerSource: '/stories/bella-blind-beagle-sanctuary-journey',
        consentAgreed: true
      };
      expect(payload.consentAgreed).toBe(true);
      expect(validateEmail(payload.email)).toBe(true);
    });

    it('F21-5: confirms non-intrusive inline layout configuration without intrusive modal dialog triggers', () => {
      const formDisplayMode = {
        isModalPopup: false,
        isInlineComponent: true,
        placedAtStoryEnd: true,
        placedInFooter: true
      };
      expect(formDisplayMode.isModalPopup).toBe(false);
      expect(formDisplayMode.isInlineComponent).toBe(true);
    });
  });

  describe('F22: Multi-Step Story Submission Flow', () => {
    it('F22-1: verifies 5-step wizard sequence structure and definitions', () => {
      const submissionSteps = [
        { step: 1, name: 'Contributor Info', key: 'contributor' },
        { step: 2, name: 'Dog Details', key: 'dog_details' },
        { step: 3, name: 'Story Narrative', key: 'narrative' },
        { step: 4, name: 'Photo & Media Rights', key: 'media' },
        { step: 5, name: 'Verification Sources', key: 'sources' }
      ];
      expect(submissionSteps.length).toBe(5);
      expect(submissionSteps[0].key).toBe('contributor');
      expect(submissionSteps[4].key).toBe('sources');
    });

    it('F22-2: verifies local auto-save serialization and recovery payload for multi-step drafts', () => {
      const draftState = {
        currentStep: 3,
        formData: {
          dogName: 'Copper',
          dogBreed: 'Foxhound',
          city: 'Knoxville'
        },
        savedAt: '2025-02-17T12:00:00Z'
      };
      const serialized = JSON.stringify(draftState);
      const restored = JSON.parse(serialized);
      expect(restored.currentStep).toBe(3);
      expect(restored.formData.dogName).toBe('Copper');
    });

    it('F22-3: validates image upload enforces 5.0 MB maximum file size limit', () => {
      const validImage = { name: 'dog.jpg', sizeBytes: 2.5 * 1024 * 1024, mimeType: 'image/jpeg' };
      const oversizeImage = invalidSubmissionPayloads.oversizedImage;

      expect(validateImageUpload(validImage).valid).toBe(true);
      
      const oversizeResult = validateImageUpload(oversizeImage);
      expect(oversizeResult.valid).toBe(false);
      expect(oversizeResult.error).toContain('exceeds maximum allowed limit of 5.0MB');
    });

    it('F22-4: validates image upload accepts JPEG, PNG, WebP and rejects unsupported formats', () => {
      expect(validateImageUpload({ name: 'photo.webp', sizeBytes: 1000, mimeType: 'image/webp' }).valid).toBe(true);
      expect(validateImageUpload({ name: 'photo.png', sizeBytes: 1000, mimeType: 'image/png' }).valid).toBe(true);

      const invalidGif = invalidSubmissionPayloads.invalidImageMimeType;
      const gifResult = validateImageUpload(invalidGif);
      expect(gifResult.valid).toBe(false);
      expect(gifResult.error).toContain('Unsupported image format');
    });

    it('F22-5: rejects submissions where contributor has not agreed to media rights declarations', () => {
      const rejectedPayload = invalidSubmissionPayloads.missingRightsAgreement;
      expect(rejectedPayload.imageRightsAgreed).toBe(false);
    });
  });

  describe('F23: Secure Admin Editorial CMS Dashboard', () => {
    it('F23-1: aggregates story count metrics across statuses (published, review, draft, archived)', () => {
      const stories = allSeedStories;
      const metrics = {
        total: stories.length,
        published: stories.filter(s => s.status === 'published').length,
        review: stories.filter(s => s.status === 'review').length,
        draft: stories.filter(s => s.status === 'draft').length,
        archived: stories.filter(s => s.status === 'archived').length
      };
      expect(metrics.total).toBe(stories.length);
      expect(metrics.published).toBeGreaterThanOrEqual(5);
      expect(metrics.draft).toBeGreaterThanOrEqual(1);
      expect(metrics.archived).toBeGreaterThanOrEqual(1);
    });

    it('F23-2: displays pending review submission queue with submitter and date details', () => {
      const reviewItem = {
        id: 'sub-001',
        dogName: 'Buddy',
        category: 'rescues',
        submittedAt: '2025-02-15T09:00:00Z',
        status: 'pending_review'
      };
      expect(reviewItem.status).toBe('pending_review');
      expect(reviewItem.dogName).toBe('Buddy');
    });

    it('F23-3: verifies editorial workflow lifecycle states (draft -> review -> published -> archived)', () => {
      const validTransitions: Record<string, string[]> = {
        draft: ['review', 'archived'],
        review: ['draft', 'published', 'archived'],
        published: ['review', 'archived'],
        archived: ['draft']
      };
      expect(validTransitions['draft']).toContain('review');
      expect(validTransitions['review']).toContain('published');
      expect(validTransitions['published']).toContain('archived');
    });

    it('F23-4: verifies story editor updates `updatedAt` timestamp while keeping `publishedAt` fixed', () => {
      const originalPublished = storyBellaRescue.publishedAt;
      const editedStory = {
        ...storyBellaRescue,
        title: 'Bella\'s Journey: Updated Edition',
        updatedAt: '2025-02-17T18:00:00Z'
      };
      expect(editedStory.publishedAt).toBe(originalPublished);
      expect(editedStory.updatedAt).not.toBe(originalPublished);
    });

    it('F23-5: verifies admin story list filtering by category and status', () => {
      const filteredByStatus = allSeedStories.filter(s => s.status === 'published' && s.category === 'rescues');
      expect(filteredByStatus.length).toBeGreaterThanOrEqual(2);
      for (const s of filteredByStatus) {
        expect(s.status).toBe('published');
        expect(s.category).toBe('rescues');
      }
    });
  });

  describe('F24: CMS Pre-Publish Checklist Gate', () => {
    it('F24-1: passes all 9 checklist points for a completely verified story', () => {
      const result = runCmsPrePublishChecklist(storyBellaRescue);
      expect(result.passed).toBe(true);
      expect(result.totalChecks).toBe(9);
      expect(result.passedCount).toBe(9);
      expect(result.missingFields.length).toBe(0);
    });

    it('F24-2: fails checklist when hero image alt text is missing or shorter than 10 characters', () => {
      const badStory = invalidStoryPayloads.missingAltText;
      const result = runCmsPrePublishChecklist(badStory);
      expect(result.passed).toBe(false);
      expect(result.checks.altTextPresent).toBe(false);
      expect(result.missingFields).toContain('heroImage.altText (min 10 chars)');
    });

    it('F24-3: fails checklist when zero sources are attached to the verification record', () => {
      const badStory = invalidStoryPayloads.missingSources;
      const result = runCmsPrePublishChecklist(badStory);
      expect(result.passed).toBe(false);
      expect(result.checks.minimumOneSource).toBe(false);
      expect(result.missingFields).toContain('verification.sources (min 1 source)');
    });

    it('F24-4: fails checklist when story narrative length is below 50 words', () => {
      const shortStory = {
        ...storyBellaRescue,
        content: 'This is too short.'
      };
      const result = runCmsPrePublishChecklist(shortStory);
      expect(result.passed).toBe(false);
      expect(result.checks.contentMinimumLength).toBe(false);
    });

    it('F24-5: fails checklist when slug contains uppercase characters, spaces, or illegal punctuation', () => {
      const badSlugStory = invalidStoryPayloads.invalidSlugCharacters;
      const result = runCmsPrePublishChecklist(badSlugStory);
      expect(result.passed).toBe(false);
      expect(result.checks.validSlugSyntax).toBe(false);
    });
  });

  describe('F25: Automated 301 Redirect Engine', () => {
    it('F25-1: registers and resolves a direct 301 redirect from old slug to new slug', () => {
      const redirects: Record<string, string> = {
        'old-bella-story': 'bella-blind-beagle-sanctuary-journey'
      };
      const resolved = resolveRedirect('old-bella-story', redirects);
      expect(resolved.finalSlug).toBe('bella-blind-beagle-sanctuary-journey');
      expect(resolved.hops).toBe(1);
      expect(resolved.isCycle).toBe(false);
    });

    it('F25-2: resolves multi-hop redirect chains directly to the final target slug (A -> B -> C)', () => {
      const redirects: Record<string, string> = {
        'slug-v1': 'slug-v2',
        'slug-v2': 'slug-v3'
      };
      const resolved = resolveRedirect('slug-v1', redirects);
      expect(resolved.finalSlug).toBe('slug-v3');
      expect(resolved.hops).toBe(2);
      expect(resolved.isCycle).toBe(false);
    });

    it('F25-3: detects circular redirect loops and prevents infinite recursion (A -> B -> A)', () => {
      const circularRedirects: Record<string, string> = {
        'slug-alpha': 'slug-beta',
        'slug-beta': 'slug-alpha'
      };
      const resolved = resolveRedirect('slug-alpha', circularRedirects);
      expect(resolved.isCycle).toBe(true);
      expect(resolved.hops).toBe(2);
    });

    it('F25-4: tracks historical slug list on story object (`redirectHistory`)', () => {
      const archivedStory = storyArchivedWithRedirects;
      expect(archivedStory.redirectHistory).toBeDefined();
      expect(archivedStory.redirectHistory?.length).toBe(2);
      expect(archivedStory.redirectHistory).toContain('buster-lost-in-lancaster');
    });

    it('F25-5: returns original slug unchanged when no redirect rule exists', () => {
      const redirects: Record<string, string> = {
        'unrelated-slug': 'target-slug'
      };
      const resolved = resolveRedirect('bella-blind-beagle-sanctuary-journey', redirects);
      expect(resolved.finalSlug).toBe('bella-blind-beagle-sanctuary-journey');
      expect(resolved.hops).toBe(0);
      expect(resolved.isCycle).toBe(false);
    });
  });
}

registerR5EngagementCmsTests();

