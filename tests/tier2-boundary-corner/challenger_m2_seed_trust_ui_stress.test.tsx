/**
 * Challenger 2 Verification Test Suite - Milestone M2
 * Focus: Seed Dataset Integrity & Trust UI Components Stress Testing
 * 
 * Requirements: ORIGINAL_REQUEST § R2, R3, R5; PROJECT.md F06, F07, F08, F09, F10, F11
 * Path: tests/tier2-boundary-corner/challenger_m2_seed_trust_ui_stress.test.tsx
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

// Domain and Data Imports
import {
  allSeedStories,
  seedStoryFixtures,
  publishedSeedStories,
  addLiveStory,
  clearAllLiveStories,
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyDaisyReunion,
  storyDukeLoyalty,
  storyLunaMiracle,
  storyRockyDraft,
  storyBusterLostFound,
  sourceMontanaHumane,
  sourceCascadeVet,
  sourcePitkinPoliceSAR,
  sourceNPSAgency,
  sourcePierceCourt,
  sourceDenverPost,
  sourceEyewitnessArthur,
  sourceSFShelter,
  sourceOhioStateVet,
  getAllStories,
  getPublishedStories,
  getStoryBySlug,
  getStoriesByCategory,
  getStoriesByTheme,
  getFeaturedStories,
  getAllStorySlugs,
  getRelatedStoriesSeed
} from '@/lib/data/stories';
import {
  validateStory,
  parseStory,
  storySchema,
  SLUG_REGEX
} from '@/domain/schemas';
import {
  Story,
  StoryCategory,
  EmotionalTheme,
  VerificationRecord,
  SourceAttribution,
  HeroImage
} from '@/domain/types';

// UI Component Imports
import {
  VerificationBadge,
  SourceAttributionList,
  ImageDisclosure,
  CorrectionModal,
  TrustCard
} from '@/components/trust';

describe('Challenger 2 Empirical Verification Suite: Seed Dataset & Trust UI', () => {
  beforeEach(() => {
    seedStoryFixtures.forEach(s => addLiveStory(s));
  });

  // ==========================================================================
  // SECTION 1: SEED DATASET INTEGRITY & QUERY FUNCTIONS
  // ==========================================================================
  describe('1. Seed Dataset Schema Conformance & Integrity (src/lib/data/stories.ts)', () => {
    
    it('1.1: Exactly 8 seed stories exist in master dataset', () => {
      expect(seedStoryFixtures).toBeDefined();
      expect(seedStoryFixtures.length).toBe(8);
      expect(seedStoryFixtures.filter(s => s.status === 'published').length).toBe(7);
    });

    it('1.2: All 8 seed stories strictly pass validateStory() Zod validation with zero errors', () => {
      for (const story of seedStoryFixtures) {
        const validation = validateStory(story);
        if (!validation.success) {
          console.error(`Validation failed for story '${story.slug}':`, validation.errors);
        }
        expect(validation.success).toBe(true);
        if (validation.success) {
          expect(validation.data.id).toBe(story.id);
          expect(validation.data.slug).toBe(story.slug);
        }
      }
    });

    it('1.3: Each individual story passes storySchema.parse() without throwing', () => {
      const individualStories: [string, Story][] = [
        ['storyBellaRescue', storyBellaRescue],
        ['storyBarnabySurvival', storyBarnabySurvival],
        ['storyMaxHero', storyMaxHero],
        ['storyDaisyReunion', storyDaisyReunion],
        ['storyDukeLoyalty', storyDukeLoyalty],
        ['storyLunaMiracle', storyLunaMiracle],
        ['storyRockyDraft', storyRockyDraft],
        ['storyBusterLostFound', storyBusterLostFound],
      ];

      for (const [name, story] of individualStories) {
        expect(() => parseStory(story)).not.toThrow();
        const parsed = parseStory(story);
        expect(parsed.title.length).toBeGreaterThanOrEqual(5);
        expect(parsed.excerpt.length).toBeGreaterThanOrEqual(10);
        expect(parsed.content.length).toBeGreaterThanOrEqual(50);
        expect(parsed.dogName.length).toBeGreaterThanOrEqual(1);
        expect(parsed.dogBreed.length).toBeGreaterThanOrEqual(1);
        expect(parsed.location.city.length).toBeGreaterThanOrEqual(1);
        expect(parsed.location.stateOrProvince.length).toBeGreaterThanOrEqual(1);
        expect(parsed.location.country.length).toBeGreaterThanOrEqual(1);
        expect(parsed.verification.confidenceScore).toBeGreaterThanOrEqual(0);
        expect(parsed.verification.confidenceScore).toBeLessThanOrEqual(100);
      }
    });

    it('1.4: Strict coverage of all 6 required categories in dataset', () => {
      const requiredCategories: StoryCategory[] = [
        'reunions',
        'hero-dogs',
        'rescues',
        'survival',
        'loyalty',
        'lost-and-found'
      ];

      const presentCategoriesAll = new Set(seedStoryFixtures.map(s => s.category));
      const presentCategoriesPublished = new Set(seedStoryFixtures.filter(s => s.status === 'published').map(s => s.category));

      for (const cat of requiredCategories) {
        expect(presentCategoriesAll.has(cat)).toBe(true);
        expect(presentCategoriesPublished.has(cat)).toBe(true);
      }

      // Verify specific category mappings
      expect(seedStoryFixtures.find(s => s.category === 'reunions')?.slug).toBe(storyDaisyReunion.slug);
      expect(seedStoryFixtures.find(s => s.category === 'hero-dogs')?.slug).toBe(storyMaxHero.slug);
      expect(seedStoryFixtures.filter(s => s.category === 'rescues').length).toBe(2); // Bella & Luna
      expect(seedStoryFixtures.find(s => s.category === 'survival')?.slug).toBe(storyBarnabySurvival.slug);
      expect(seedStoryFixtures.find(s => s.category === 'loyalty')?.slug).toBe(storyDukeLoyalty.slug);
      expect(seedStoryFixtures.filter(s => s.category === 'lost-and-found').length).toBe(2); // Buster & Rocky
    });

    it('1.5: Slug format adherence and unique identity constraints', () => {
      const slugs = seedStoryFixtures.map(s => s.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(seedStoryFixtures.length);

      for (const slug of slugs) {
        expect(SLUG_REGEX.test(slug)).toBe(true);
        expect(slug).toBe(slug.toLowerCase());
        expect(slug.startsWith('-')).toBe(false);
        expect(slug.endsWith('-')).toBe(false);
      }

      const ids = seedStoryFixtures.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(seedStoryFixtures.length);
    });

    it('1.6: AI visual reconstruction disclosures are complete and compliant', () => {
      const aiStories = seedStoryFixtures.filter(s => s.heroImage.licenseType === 'ai_visual_reconstruction');
      expect(aiStories.length).toBeGreaterThanOrEqual(1);

      for (const story of aiStories) {
        expect(story.heroImage.aiDisclosure).toBeDefined();
        expect(story.heroImage.aiDisclosure?.isAiGenerated).toBe(true);
        expect(story.heroImage.aiDisclosure?.aiToolUsed).toBeDefined();
        expect((story.heroImage.aiDisclosure?.aiToolUsed || '').length).toBeGreaterThanOrEqual(2);
        expect((story.heroImage.aiDisclosure?.reconstructionRationale || '').length).toBeGreaterThanOrEqual(10);
      }
    });

    it('1.7: Non-AI images have valid authentic license types and credits', () => {
      const nonAiStories = seedStoryFixtures.filter(s => s.heroImage.licenseType !== 'ai_visual_reconstruction');
      for (const story of nonAiStories) {
        expect(story.heroImage.credit.length).toBeGreaterThanOrEqual(2);
        expect([
          'original_photography',
          'official_source_release',
          'licensed_stock',
          'user_submitted_verified'
        ]).toContain(story.heroImage.licenseType);
      }
    });
  });

  // ==========================================================================
  // SECTION 2: QUERY FUNCTIONS STRESS & EDGE CASES
  // ==========================================================================
  describe('2. Query Functions Resilience & Edge Cases (src/lib/data/stories.ts)', () => {
    
    it('2.1: getAllStories() and getPublishedStories() immutability and counts', () => {
      const all = getAllStories();
      const published = getPublishedStories();

      expect(all.length).toBe(8);
      expect(published.length).toBe(7);

      // Verify array copying (modifying return array does not mutate seed collection)
      all.pop();
      expect(all.length).toBe(7);
      expect(getAllStories().length).toBe(8);
    });

    it('2.2: getStoryBySlug() handles canonical slugs, case-insensitivity, whitespace, redirects, and non-existent slugs', () => {
      // Canonical slug
      const bella = getStoryBySlug('bella-blind-beagle-sanctuary-journey');
      expect(bella).toBeDefined();
      expect(bella?.id).toBe('story-bella-rescue-001');

      // Case insensitivity & trimming
      const bellaMixed = getStoryBySlug('  BELLA-blind-Beagle-Sanctuary-Journey  ');
      expect(bellaMixed).toBeDefined();
      expect(bellaMixed?.id).toBe('story-bella-rescue-001');

      // Redirect history slugs
      const busterRedirect1 = getStoryBySlug('buster-lost-in-lancaster');
      expect(busterRedirect1).toBeDefined();
      expect(busterRedirect1?.id).toBe('story-archived-008');

      const busterRedirect2 = getStoryBySlug('buster-county-search-2024');
      expect(busterRedirect2).toBeDefined();
      expect(busterRedirect2?.id).toBe('story-archived-008');

      // Non-existent slug returns undefined without throwing
      expect(getStoryBySlug('non-existent-dog-rescue-slug-99999')).toBeUndefined();
      expect(getStoryBySlug('')).toBeUndefined();
      expect(getStoryBySlug('   ')).toBeUndefined();
      expect(getStoryBySlug(null as unknown as string)).toBeUndefined();
      expect(getStoryBySlug(undefined as unknown as string)).toBeUndefined();
    });

    it('2.3: getStoriesByCategory() returns correct subsets and handles unknown category gracefully', () => {
      const rescues = getStoriesByCategory('rescues');
      expect(rescues.length).toBe(2);
      expect(rescues.every(s => s.category === 'rescues')).toBe(true);

      const survival = getStoriesByCategory('survival');
      expect(survival.length).toBe(1);
      expect(survival[0].slug).toBe('barnaby-golden-retriever-flood-survival');

      const lostAndFound = getStoriesByCategory('lost-and-found');
      // Only published stories returned (storyRockyDraft is draft)
      expect(lostAndFound.length).toBe(1);
      expect(lostAndFound[0].slug).toBe('buster-lost-and-found-legacy');

      // Graceful handling of invalid category
      const invalidCat = getStoriesByCategory('unknown-cat' as StoryCategory);
      expect(Array.isArray(invalidCat)).toBe(true);
      expect(invalidCat.length).toBe(0);
    });

    it('2.4: getStoriesByTheme() returns matching emotional theme subsets', () => {
      const inspiring = getStoriesByTheme('inspiring');
      expect(inspiring.length).toBeGreaterThanOrEqual(3);
      expect(inspiring.every(s => s.emotionalThemes.includes('inspiring'))).toBe(true);

      const tearjerker = getStoriesByTheme('tearjerker');
      expect(tearjerker.length).toBe(1);
      expect(tearjerker[0].slug).toBe('daisy-500-mile-reunion-microchip-miracle');

      const nonExistentTheme = getStoriesByTheme('scary' as EmotionalTheme);
      expect(Array.isArray(nonExistentTheme)).toBe(true);
      expect(nonExistentTheme.length).toBe(0);
    });

    it('2.5: getFeaturedStories() returns exclusively featured stories', () => {
      const featured = getFeaturedStories();
      expect(featured.length).toBe(3);
      expect(featured.every(s => s.featured === true)).toBe(true);
      expect(featured.map(s => s.dogName)).toEqual(expect.arrayContaining(['Bella', 'Barnaby', 'Max']));
    });

    it('2.6: getAllStorySlugs() returns published slugs for static generation', () => {
      const slugs = getAllStorySlugs();
      expect(slugs.length).toBe(7);
      expect(slugs).toContain('bella-blind-beagle-sanctuary-journey');
      expect(slugs).toContain('barnaby-golden-retriever-flood-survival');
      expect(slugs).toContain('max-avalanche-search-dog-aspen');
      expect(slugs).toContain('daisy-500-mile-reunion-microchip-miracle');
      expect(slugs).toContain('duke-loyal-hound-appalachian-trail');
      expect(slugs).toContain('luna-second-chance-prosthetic-pioneer');
      expect(slugs).toContain('buster-lost-and-found-legacy');
      // Draft story excluded
      expect(slugs).not.toContain('rocky-draft-backyard-adventure');
    });

    it('2.7: getRelatedStoriesSeed() scoring algorithm, limit constraints, and edge cases', () => {
      // 1. Excludes current story
      const relatedBella = getRelatedStoriesSeed(storyBellaRescue, 3);
      expect(relatedBella.length).toBeLessThanOrEqual(3);
      expect(relatedBella.some(s => s.id === storyBellaRescue.id)).toBe(false);

      // 2. Luna should rank highly for Bella (both category 'rescues' [+3] + shared 'inspiring' and 'miraculous' [+4] = +7)
      expect(relatedBella[0].id).toBe(storyLunaMiracle.id);

      // 3. Limit testing
      expect(getRelatedStoriesSeed(storyBellaRescue, 1).length).toBe(1);
      expect(getRelatedStoriesSeed(storyBellaRescue, 5).length).toBe(5);
      expect(getRelatedStoriesSeed(storyBellaRescue, 0).length).toBe(0);

      // 4. Custom standalone story not in seed dataset
      const customStory: Story = {
        ...storyBellaRescue,
        id: 'custom-story-999',
        category: 'hero-dogs',
        dogBreed: 'Belgian Malinois',
        emotionalThemes: ['brave', 'inspiring']
      };
      const relatedCustom = getRelatedStoriesSeed(customStory, 2);
      expect(relatedCustom.length).toBe(2);
      // Max Malinois should rank highest for custom Belgian Malinois hero dog story
      expect(relatedCustom[0].id).toBe(storyMaxHero.id);
    });
  });

  // ==========================================================================
  // SECTION 3: TRUST UI COMPONENTS STRESS & BOUNDARY TESTS
  // ==========================================================================
  describe('3. Trust UI Components Stress & Boundary Testing', () => {

    // ------------------------------------------------------------------------
    // VerificationBadge Tests
    // ------------------------------------------------------------------------
    describe('VerificationBadge Component', () => {
      it('renders all 4 verification tiers with proper color classes and accessibility attributes', () => {
        const { rerender } = render(<VerificationBadge status="Strongly Verified" confidenceScore={99} />);
        const stronglyEl = screen.getByRole('status');
        expect(stronglyEl).toHaveTextContent('Strongly Verified');
        expect(stronglyEl.getAttribute('aria-label')).toContain('Strongly Verified');
        expect(stronglyEl.getAttribute('aria-label')).toContain('99%');
        expect(stronglyEl.className).toContain('bg-[#EBF3ED]');

        rerender(<VerificationBadge status="Verified" confidenceScore={80} />);
        const verifiedEl = screen.getByRole('status');
        expect(verifiedEl).toHaveTextContent('Verified');
        expect(verifiedEl.className).toContain('text-[#234E35]');

        rerender(<VerificationBadge status="Partially Verified" confidenceScore={50} />);
        const partiallyEl = screen.getByRole('status');
        expect(partiallyEl).toHaveTextContent('Partially Verified');
        expect(partiallyEl.className).toContain('bg-[#FEF7EC]');
        expect(partiallyEl.className).toContain('text-[#8A5200]');

        rerender(<VerificationBadge status="Unverified" confidenceScore={0} />);
        const unverifiedEl = screen.getByRole('status');
        expect(unverifiedEl).toHaveTextContent('Unverified');
        expect(unverifiedEl.className).toContain('bg-[#F4F0EA]');
      });

      it('renders optional elements: score percentage, status dot, and icon toggles', () => {
        const { rerender } = render(
          <VerificationBadge
            status="Strongly Verified"
            confidenceScore={95}
            showScore={true}
            showDot={true}
            showIcon={true}
          />
        );
        expect(screen.getByText('(95%)')).toBeInTheDocument();

        // Rerender with showScore=false, showIcon=false
        rerender(
          <VerificationBadge
            status="Strongly Verified"
            confidenceScore={95}
            showScore={false}
            showIcon={false}
          />
        );
        expect(screen.queryByText('(95%)')).not.toBeInTheDocument();
      });

      it('gracefully handles invalid status with fallback to Unverified config', () => {
        render(<VerificationBadge status={'UnknownStatus' as any} />);
        const badge = screen.getByRole('status');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent('Unverified');
      });
    });

    // ------------------------------------------------------------------------
    // SourceAttributionList Tests (0, 1, 20+ sources, URL sanitization)
    // ------------------------------------------------------------------------
    describe('SourceAttributionList Component', () => {
      it('0 sources: renders empty/progress state reassurance message', () => {
        render(<SourceAttributionList sources={[]} />);
        expect(
          screen.getByText(/Verification in progress by editorial staff\. No public source records attached yet\./i)
        ).toBeInTheDocument();
      });

      it('1 source: renders single institutional source with document reference and sanitized link', () => {
        render(<SourceAttributionList sources={[sourceMontanaHumane]} />);
        expect(screen.getByText(/Humane Society of Western Montana/i)).toBeInTheDocument();
        expect(screen.getByText(/Ref: INTAKE-DOC-MT-2024-8841/i)).toBeInTheDocument();
        expect(screen.getByText(/Shelter \/ Rescue Intake/i)).toBeInTheDocument();
        expect(screen.getByText(/Institutional Archive/i)).toBeInTheDocument();
        
        const link = screen.getByRole('link', { name: /View Record/i });
        expect(link).toHaveAttribute('href', 'https://www.montanahumane.org/records/bella-2024');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });

      it('20+ sources: enforces max-h-80 overflow scroll container with keyboard tabIndex', () => {
        const twentySources: SourceAttribution[] = Array.from({ length: 22 }, (_, i) => ({
          id: `src-stress-${i}`,
          name: `Institutional Authority Office #${i + 1}`,
          type: (i % 2 === 0 ? 'police' : 'veterinary_clinic') as any,
          organization: `Department of Public Safety Division ${i + 1}`,
          documentReference: `REF-SAR-2025-${1000 + i}`,
          verifiedDate: '2025-01-15T12:00:00Z',
          url: `https://official-agency-${i}.gov/record`,
          notes: `Corroborated telemetry and logs for dispatch unit ${i + 1}.`
        }));

        const { container } = render(<SourceAttributionList sources={twentySources} />);
        
        // Check scrollable wrapper
        const scrollContainer = container.querySelector('.max-h-80.overflow-y-auto');
        expect(scrollContainer).toBeInTheDocument();
        expect(scrollContainer).toHaveAttribute('tabIndex', '0');
        expect(scrollContainer).toHaveAttribute('aria-label', 'Scrollable source attributions list');

        // Check that all 22 sources are rendered in DOM
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBe(22);
      });

      it('sanitizes dangerous URL protocols (javascript:, data:, vbscript:) and does not render unsafe links', () => {
        const unsafeSources: SourceAttribution[] = [
          {
            id: 'src-malicious-1',
            name: 'Malicious Source Scheme',
            type: 'news_outlet',
            url: 'javascript:alert("XSS")',
            verifiedDate: '2025-01-01T00:00:00Z'
          },
          {
            id: 'src-malicious-2',
            name: 'Data URI Scheme',
            type: 'eyewitness',
            url: 'data:text/html,<script>alert(1)</script>',
            verifiedDate: '2025-01-01T00:00:00Z'
          }
        ];

        render(<SourceAttributionList sources={unsafeSources} />);
        expect(screen.getByText('Malicious Source Scheme')).toBeInTheDocument();
        expect(screen.getByText('Data URI Scheme')).toBeInTheDocument();
        
        // No links should be rendered for malicious URLs
        const links = screen.queryAllByRole('link');
        expect(links.length).toBe(0);
      });

      it('renders community source without document reference or URL gracefully', () => {
        const communitySource: SourceAttribution = {
          id: 'src-comm-1',
          name: 'Local Hiker Witness',
          type: 'eyewitness',
          verifiedDate: '2025-02-12T15:45:00Z',
          notes: 'Eyewitness interview recorded by telephone.'
        };

        render(<SourceAttributionList sources={[communitySource]} />);
        expect(screen.getByText('Local Hiker Witness')).toBeInTheDocument();
        expect(screen.getByText('Eyewitness Interview')).toBeInTheDocument();
        expect(screen.getByText('Community Corroboration')).toBeInTheDocument();
        expect(screen.queryByText(/Ref:/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
      });
    });

    // ------------------------------------------------------------------------
    // ImageDisclosure Tests (AI vs Authentic)
    // ------------------------------------------------------------------------
    describe('ImageDisclosure Component', () => {
      it('renders AI visual reconstruction disclosure with tool name and rationale', () => {
        render(<ImageDisclosure image={storyLunaMiracle.heroImage} />);
        
        const note = screen.getByRole('note');
        expect(note).toBeInTheDocument();
        expect(note).toHaveAttribute('aria-label', 'Image Transparency Disclosure: AI Visual Reconstruction');
        expect(screen.getByText(/AI Visual Reconstruction • Transparency Disclosed/i)).toBeInTheDocument();
        expect(screen.getByText(/Midjourney v6 & Adobe Firefly/i)).toBeInTheDocument();
        expect(screen.getByText(/Archival visual reconstruction created from verified veterinary blueprints/i)).toBeInTheDocument();
        expect(screen.getByText(/Ethics Pledge: We never use AI to fabricate story events\./i)).toBeInTheDocument();
      });

      it('renders standard photography credit line for authentic images', () => {
        render(<ImageDisclosure image={storyBellaRescue.heroImage} />);
        expect(screen.getByText(/Montana Humane Society \/ Mark Peterson Photography/i)).toBeInTheDocument();
        expect(screen.getByText(/OFFICIAL SOURCE RELEASE/i)).toBeInTheDocument();
        expect(screen.queryByRole('note')).not.toBeInTheDocument();
      });

      it('falls back to "Eternal Paws Archive" when credit is omitted in non-AI photo', () => {
        const imageWithoutCredit: HeroImage = {
          url: 'https://images.eternal-paws.org/stock.webp',
          altText: 'A happy puppy playing outdoors in green grass',
          credit: '',
          licenseType: 'licensed_stock',
          width: 800,
          height: 600,
          aspectRatio: '4:3'
        };

        render(<ImageDisclosure image={imageWithoutCredit} />);
        expect(screen.getByText(/Eternal Paws Archive/i)).toBeInTheDocument();
        expect(screen.getByText(/LICENSED STOCK/i)).toBeInTheDocument();
      });
    });

    // ------------------------------------------------------------------------
    // CorrectionModal Boundary & Intake Tests
    // ------------------------------------------------------------------------
    describe('CorrectionModal Boundary & Validation Testing', () => {
      it('does not render dialog when isOpen is false', () => {
        render(
          <CorrectionModal
            isOpen={false}
            onClose={vi.fn()}
            storySlug="bella-blind-beagle"
          />
        );
        expect(screen.queryByRole('heading', { name: /Submit a Factual Correction/i })).not.toBeInTheDocument();
      });

      it('pre-populates story slug and title when opened', () => {
        render(
          <CorrectionModal
            isOpen={true}
            onClose={vi.fn()}
            storySlug="bella-blind-beagle-sanctuary-journey"
            storyTitle="Bella's Journey"
          />
        );
        expect(screen.getByRole('heading', { name: /Submit a Factual Correction/i })).toBeInTheDocument();
        const slugInput = screen.getByLabelText(/Story Slug or Headline/i) as HTMLInputElement;
        expect(slugInput.value).toContain('Bella\'s Journey (bella-blind-beagle-sanctuary-journey)');
      });

      it('validates empty submissions and displays field-level error messages', async () => {
        render(
          <CorrectionModal
            isOpen={true}
            onClose={vi.fn()}
            storySlug=""
          />
        );

        // Click submit on completely empty form
        fireEvent.click(screen.getByRole('button', { name: /Submit Correction Ticket/i }));

        expect(await screen.findByText(/Story slug or URL is required\./i)).toBeInTheDocument();
        expect(screen.getByText(/Please provide your full name or organization\./i)).toBeInTheDocument();
        expect(screen.getByText(/Please provide a valid email address\./i)).toBeInTheDocument();
        expect(screen.getByText(/Please describe the claimed inaccuracy in at least 10 characters\./i)).toBeInTheDocument();
        expect(screen.getByText(/Please provide correction details in at least 20 characters\./i)).toBeInTheDocument();
      });

      it('validates email format boundaries (rejects invalid emails, accepts valid)', async () => {
        render(
          <CorrectionModal
            isOpen={true}
            onClose={vi.fn()}
            storySlug="bella-rescue"
          />
        );

        const emailInput = screen.getByLabelText(/Contact Email/i);
        const nameInput = screen.getByLabelText(/Your Name \/ Organization/i);
        const claimInput = screen.getByLabelText(/Specific Claim in Question/i);
        const detailsInput = screen.getByLabelText(/Proposed Correction & Context/i);
        const submitBtn = screen.getByRole('button', { name: /Submit Correction Ticket/i });

        fireEvent.change(nameInput, { target: { value: 'Dr. Jane Smith' } });
        fireEvent.change(claimInput, { target: { value: 'The year of rescue was 2024 not 2023.' } });
        fireEvent.change(detailsInput, { target: { value: 'Shelter intake logs confirm date was November 2024.' } });

        // Test invalid emails
        const invalidEmails = ['plainaddress', 'missing@domain', '@missinguser.com', 'user@domain.'];
        for (const invalid of invalidEmails) {
          fireEvent.change(emailInput, { target: { value: invalid } });
          fireEvent.click(submitBtn);
          expect(await screen.findByText(/Please provide a valid email address\./i)).toBeInTheDocument();
        }

        // Test valid email
        fireEvent.change(emailInput, { target: { value: 'jane.smith@veterinary.org' } });
        fireEvent.click(submitBtn);
        await waitFor(() => {
          expect(screen.queryByText(/Please provide a valid email address\./i)).not.toBeInTheDocument();
        });
      });

      it('enforces correctionDetails min 20 chars and max 3000 chars boundaries', async () => {
        render(
          <CorrectionModal
            isOpen={true}
            onClose={vi.fn()}
            storySlug="bella-rescue"
          />
        );

        const nameInput = screen.getByLabelText(/Your Name \/ Organization/i);
        const emailInput = screen.getByLabelText(/Contact Email/i);
        const claimInput = screen.getByLabelText(/Specific Claim in Question/i);
        const detailsInput = screen.getByLabelText(/Proposed Correction & Context/i);
        const submitBtn = screen.getByRole('button', { name: /Submit Correction Ticket/i });

        fireEvent.change(nameInput, { target: { value: 'Alice' } });
        fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
        fireEvent.change(claimInput, { target: { value: 'The location was mislabeled.' } });

        // 19 characters (< 20 minimum)
        fireEvent.change(detailsInput, { target: { value: '1234567890123456789' } });
        fireEvent.click(submitBtn);
        expect(await screen.findByText(/Please provide correction details in at least 20 characters\./i)).toBeInTheDocument();

        // 3001 characters (> 3000 maximum)
        fireEvent.change(detailsInput, { target: { value: 'A'.repeat(3001) } });
        fireEvent.click(submitBtn);
        expect(await screen.findByText(/Correction details cannot exceed 3000 characters\./i)).toBeInTheDocument();
      });

      it('submits valid correction and generates standard ticket format CORR-YYYY-MMDD-XXXX', async () => {
        const onCloseMock = vi.fn();
        render(
          <CorrectionModal
            isOpen={true}
            onClose={onCloseMock}
            storySlug="bella-blind-beagle-sanctuary-journey"
          />
        );

        fireEvent.change(screen.getByLabelText(/Your Name \/ Organization/i), {
          target: { value: 'Marcus Brody, DVM' }
        });
        fireEvent.change(screen.getByLabelText(/Contact Email/i), {
          target: { value: 'mbrody@vetclinic.org' }
        });
        fireEvent.change(screen.getByLabelText(/Specific Claim in Question/i), {
          target: { value: 'Intake weight was listed as 22 lbs instead of 18 lbs.' }
        });
        fireEvent.change(screen.getByLabelText(/Proposed Correction & Context/i), {
          target: { value: 'Clinical intake records from Nov 14 confirm intake weight was 18.2 lbs.' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Submit Correction Ticket/i }));

        // Wait for ticket reception screen
        expect(await screen.findByText(/Correction Ticket Received/i, {}, { timeout: 2000 })).toBeInTheDocument();
        
        // Verify ticket code format: CORR-YYYY-MMDD-XXXX
        const ticketRegex = /^CORR-\d{4}-\d{4}-[A-Z0-9]{4}$/;
        const ticketEl = screen.getByText(/CORR-\d{4}-\d{4}-[A-Z0-9]{4}/);
        expect(ticketEl).toBeInTheDocument();
        expect(ticketRegex.test(ticketEl.textContent || '')).toBe(true);

        expect(screen.getByText(/mbrody@vetclinic\.org/i)).toBeInTheDocument();

        // Click Done to reset and close
        fireEvent.click(screen.getByRole('button', { name: /Done/i }));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });

    // ------------------------------------------------------------------------
    // TrustCard Full Integration & Fallback Tests
    // ------------------------------------------------------------------------
    describe('TrustCard Component Stress & Fallback Testing', () => {
      it('renders full trust card with badge, fact-checker, date, progress meter, and sources', () => {
        render(
          <TrustCard
            verification={storyBellaRescue.verification}
            storySlug={storyBellaRescue.slug}
            storyTitle={storyBellaRescue.title}
          />
        );

        expect(screen.getByRole('heading', { name: /Editorial Trust & Verification Record/i })).toBeInTheDocument();
        expect(screen.getByText(/Elena Rostova, Senior Fact Checker/i)).toBeInTheDocument();
        expect(screen.getByText('95 / 100')).toBeInTheDocument();

        const progressbar = screen.getByRole('progressbar');
        expect(progressbar).toHaveAttribute('aria-valuenow', '95');
        expect(progressbar).toHaveAttribute('aria-valuemin', '0');
        expect(progressbar).toHaveAttribute('aria-valuemax', '100');

        expect(screen.getByText(/Verified Sources \(2\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Verification Methodology:/i)).toBeInTheDocument();
      });

      it('falls back to "Eternal Paws Editorial Board" when factChecker name is missing or whitespace', () => {
        const { rerender } = render(
          <TrustCard
            verification={{
              ...storyBellaRescue.verification,
              verifiedBy: ''
            }}
            storySlug="test-slug"
          />
        );
        expect(screen.getByText(/Eternal Paws Editorial Board/i)).toBeInTheDocument();

        rerender(
          <TrustCard
            verification={{
              ...storyBellaRescue.verification,
              verifiedBy: '     '
            }}
            storySlug="test-slug"
          />
        );
        expect(screen.getByText(/Eternal Paws Editorial Board/i)).toBeInTheDocument();
      });

      it('falls back to "Pending Review" when verifiedAt date is omitted', () => {
        render(
          <TrustCard
            verification={{
              ...storyBellaRescue.verification,
              verifiedAt: ''
            }}
            storySlug="test-slug"
          />
        );
        expect(screen.getByText(/Pending Review/i)).toBeInTheDocument();
      });

      it('toggles sources panel expanded and collapsed state with proper ARIA attributes', () => {
        render(
          <TrustCard
            verification={storyBellaRescue.verification}
            storySlug={storyBellaRescue.slug}
          />
        );

        const toggleBtn = screen.getByRole('button', { name: /Verified Sources \(2\)/i });
        const panel = screen.getByRole('region', { name: /Verified Sources \(2\)/i });

        // Initially expanded
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
        expect(panel).not.toHaveAttribute('hidden');

        // Collapse
        fireEvent.click(toggleBtn);
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
        expect(panel).toHaveAttribute('hidden');

        // Re-expand
        fireEvent.click(toggleBtn);
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
        expect(panel).not.toHaveAttribute('hidden');
      });

      it('opens CorrectionModal and populates story context when "Submit a Correction" is clicked', async () => {
        render(
          <TrustCard
            verification={storyBellaRescue.verification}
            storySlug={storyBellaRescue.slug}
            storyTitle={storyBellaRescue.title}
          />
        );

        const submitCorrectionBtn = screen.getByRole('button', { name: /Submit a Correction/i });
        fireEvent.click(submitCorrectionBtn);

        expect(await screen.findByRole('heading', { name: /Submit a Factual Correction/i })).toBeInTheDocument();
        const slugInput = screen.getByLabelText(/Story Slug or Headline/i) as HTMLInputElement;
        expect(slugInput.value).toContain(storyBellaRescue.slug);
      });
    });
  });
});
